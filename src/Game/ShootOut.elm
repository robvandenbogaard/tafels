module Game.ShootOut exposing (Model, Msg, init, subscriptions, update, view)

import Browser
import Browser.Events exposing (onKeyDown)
import Dict exposing (Dict)
import Game.ShootOut.Clone as Clone
import Game.ShootOut.Droid as Droid
import Html
import Html.Attributes as Html
import Html.Events as Html
import Html.Keyed
import Html.Lazy
import Json.Decode as Decode
import Json.Encode as Encode
import LocalStorage exposing (LocalStorage)
import LocalStoragePort
import Set exposing (Set)
import Time


type alias Model =
    { exercises : List Exercise
    , achievements : Achievements
    , state : State
    , storage : LocalStorage Msg
    , time : Int
    , factors : List Int
    , sounds : List ( Int, Bool )
    }


type alias Exercise =
    { outcome : Int
    , factors : List Int
    }


type alias Achievements =
    { successes : Int
    , fails : Int
    , speed : Float
    }


type alias Answer =
    { exercise : Exercise
    , answers : List { factor : Int, time : Int }
    }


type State
    = Load
    | Start
    | Prompt Int Int Answer
    | Reveal Answer
    | Finish


type Msg
    = Selected Int
    | Next
    | Tick Time.Posix
    | LocalStorageOp LocalStorage.Response


keyDecoder : Decode.Decoder Msg
keyDecoder =
    Decode.map keyMsg (Decode.field "key" Decode.string)
        |> Decode.andThen
            (\msg ->
                case msg of
                    Nothing ->
                        Decode.fail "key passed on"

                    Just m ->
                        Decode.succeed m
            )


keyMsg : String -> Maybe Msg
keyMsg string =
    case string of
        "Enter" ->
            Just Next

        _ ->
            Nothing


init =
    let
        storage =
            LocalStoragePort.make "tafels.shootout"
    in
    ( { factors = [ 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 15, 20, 25 ]
      , exercises = []
      , achievements = Achievements 0 0 0.0
      , state = Load
      , storage = storage
      , time = 0
      , sounds = []
      }
    , LocalStorage.getItem storage "achievements"
    )


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
        [ onKeyDown keyDecoder
        , Time.every 100 Tick
        , model.storage
            |> LocalStorage.responseHandler LocalStorageOp
            |> LocalStoragePort.response
        ]


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Next ->
            case model.state of
                Load ->
                    ( model, Cmd.none )

                Start ->
                    advance
                        { model
                            | exercises = exercisesFromTafels model.factors (List.range 2 12)
                            , sounds = []
                        }

                Prompt _ _ _ ->
                    ( model, Cmd.none )

                Reveal _ ->
                    advance model

                Finish ->
                    ( { model | state = Start }, Cmd.none )

        Selected i ->
            case model.state of
                Prompt start budget { exercise, answers } ->
                    if model.time - start < budget then
                        let
                            attempt =
                                Answer exercise ({ factor = i, time = model.time - start } :: answers)

                            sounds =
                                ( model.time, correctAnswer i exercise.outcome ) :: model.sounds
                        in
                        ( { model | sounds = sounds, state = Prompt start budget attempt }, Cmd.none )

                    else
                        ( model, Cmd.none )

                _ ->
                    ( model, Cmd.none )

        Tick posix ->
            let
                millis =
                    Time.posixToMillis posix
            in
            case model.state of
                Prompt start budget answer ->
                    let
                        removeAfterDecay =
                            List.filter (\( t, _ ) -> (model.time - t) < 3000)

                        sounds =
                            removeAfterDecay model.sounds
                    in
                    if millis - start > budget then
                        -- && sounds == [] then
                        ( { model | time = millis, sounds = sounds, state = Reveal answer }, Cmd.none )

                    else
                        ( { model | time = millis }, Cmd.none )

                _ ->
                    ( { model | time = millis }, Cmd.none )

        LocalStorageOp res ->
            case res of
                LocalStorage.Item key value ->
                    let
                        achievementsDecoder =
                            Decode.map3 Achievements
                                (Decode.field "successes" Decode.int)
                                (Decode.field "fails" Decode.int)
                                (Decode.field "speed" Decode.float)

                        achievements =
                            Decode.decodeValue achievementsDecoder value
                                |> Result.withDefault model.achievements
                    in
                    ( { model | state = Start, achievements = achievements }, Cmd.none )

                LocalStorage.ItemNotFound key ->
                    ( { model | state = Start }, Cmd.none )

                LocalStorage.KeyList keys ->
                    ( { model | state = Start }, Cmd.none )

                LocalStorage.Error errMsg ->
                    ( { model | state = Start }, Cmd.none )


advance : Model -> ( Model, Cmd Msg )
advance model =
    case Debug.log "Ex" model.exercises of
        nextExercise :: exercises ->
            let
                budget =
                    2500 + 750 * List.length nextExercise.factors
            in
            ( { model
                | exercises = exercises
                , state = Prompt model.time budget { exercise = nextExercise, answers = [] }
              }
            , Cmd.none
            )

        [] ->
            ( { model
                | state = Finish
              }
            , [ ( "successes", Encode.int model.achievements.successes )
              , ( "fails", Encode.int model.achievements.fails )
              , ( "speed", Encode.float model.achievements.speed )
              ]
                |> Encode.object
                |> LocalStorage.setItem model.storage "achievements"
            )


viewSounds =
    List.indexedMap
        (\i ( t, correct ) ->
            let
                ( prefix, max ) =
                    case correct of
                        True ->
                            ( "clone-shot-", 5 )

                        False ->
                            ( "aargh-", 3 )
            in
            Html.audio [ Html.autoplay True, Html.src <| prefix ++ String.fromInt (modBy max i + 1) ++ ".mp3" ] []
        )


view model =
    Html.div [] <|
        List.concat
            [ viewSounds model.sounds
            , [ case model.state of
                    Load ->
                        Html.p [] [ Html.text "Momentje.." ]

                    Start ->
                        Html.div []
                            [ Html.p []
                                [ Html.text <| "Klaar voor de start?"
                                ]
                            , Html.p []
                                [ Html.button [ Html.onClick Next ] [ Html.text "Start!" ]
                                ]
                            ]

                    Finish ->
                        Html.div []
                            [ Html.p []
                                [ Html.text "Hoera, alle sommen goed!" ]
                            ]

                    Prompt input _ ({ exercise, answers } as attempt) ->
                        Html.div []
                            [ Html.p []
                                [ Html.text <|
                                    "Uit welke tafel(s) komt "
                                        ++ String.fromInt exercise.outcome
                                        ++ "?"
                                ]
                            , Html.p
                                [ Html.style "display" "flex"
                                , Html.style "flex-direction" "row"
                                , Html.style "flex-wrap" "wrap"
                                , Html.style "justify-content" "space-evenly"
                                ]
                              <|
                                viewFactors attempt model.factors
                            ]

                    Reveal ({ exercise, answers } as attempt) ->
                        Html.div []
                            [ Html.p [] [ Html.text <| "Uit welke tafel(s) komt " ++ String.fromInt exercise.outcome ++ "?" ]
                            , Html.p
                                [ Html.style "display" "flex"
                                , Html.style "flex-direction" "row"
                                , Html.style "flex-wrap" "wrap"
                                , Html.style "justify-content" "space-evenly"
                                ]
                              <|
                                viewAnswers attempt model.factors
                            , Html.p []
                                [ Html.button [ Html.onClick Next ] [ Html.text "Volgende!" ]
                                ]
                            ]
              ]
            ]


correctAnswer factor outcome =
    remainderBy factor outcome == 0


viewFactors { exercise, answers } factors =
    List.map (viewFactor exercise.outcome (List.map .factor answers)) factors


viewFactor outcome guesses factor =
    let
        shadow =
            Html.style "box-shadow" "gray 0 1px 3px"

        styleBase =
            [ Html.style "position" "relative"
            , Html.style "height" "9rem"
            , Html.style "width" "4rem"
            , Html.style "margin" "0.5rem"
            ]

        styleFactor =
            [ Html.style "position" "absolute"
            , Html.style "bottom" "0"
            , Html.style "left" "0"
            , Html.style "right" "0"
            , Html.style "font-weight" "bold"
            , Html.style "font-family" "monospace"
            , Html.style "font-size" "5vh"
            ]
    in
    if List.member factor guesses then
        Html.div
            styleBase
            (if outcome == factor then
                [ Html.div
                    (shadow :: styleFactor)
                    [ Html.text <| String.fromInt factor ]
                ]

             else if correctAnswer factor outcome then
                -- this needs to go into the generator instead,
                -- because here it will not be taken into account
                -- with the budget
                [ Droid.drawing
                , Html.div
                    styleFactor
                    [ Html.text <| String.fromInt factor
                    , Html.span [ Html.style "font-size" "3vh" ]
                        [ Html.text <| "x" ++ String.fromInt (outcome // factor) ]
                    ]
                ]

             else
                [ Clone.drawing
                , Html.div
                    styleFactor
                    [ Html.text <| String.fromInt factor ]
                ]
            )

    else
        Html.div
            (Html.onClick (Selected factor)
                :: shadow
                :: styleBase
            )
            [ Html.div
                (Html.style "top" "30%" :: styleFactor)
                [ Html.text <| String.fromInt factor ]
            ]


viewAnswers { exercise, answers } factors =
    let
        guesses =
            List.map .factor answers
    in
    List.map (viewAnswer exercise.outcome guesses exercise.factors) factors


viewAnswer outcome guesses factors factor =
    let
        styleBase =
            [ Html.style "position" "relative"
            , Html.style "height" "9rem"
            , Html.style "width" "4rem"
            , Html.style "margin" "0.5rem"
            ]

        styleHit color =
            if List.member factor guesses then
                [ Html.style "background" color ]

            else
                []

        styleFactor =
            [ Html.style "position" "absolute"
            , Html.style "bottom" "0"
            , Html.style "left" "0"
            , Html.style "right" "0"
            , Html.style "font-weight" "bold"
            , Html.style "font-family" "monospace"
            , Html.style "font-size" "5vh"
            ]
    in
    if outcome == factor then
        Html.div (styleBase ++ styleHit "yellow")
            [ Html.div
                styleFactor
                [ Html.text <| String.fromInt factor ]
            ]

    else if correctAnswer factor outcome then
        -- this needs to go into the generator instead,
        -- because here it will not be taken into account
        -- with the budget
        Html.div (styleBase ++ styleHit "lime")
            [ Droid.drawing
            , Html.div
                styleFactor
                [ Html.text <| String.fromInt factor
                , Html.span [ Html.style "font-size" "3vh" ]
                    [ Html.text <| "x" ++ String.fromInt (outcome // factor) ]
                ]
            ]

    else
        Html.div (styleBase ++ styleHit "red")
            [ Clone.drawing
            , Html.div
                styleFactor
                [ Html.text <| String.fromInt factor ]
            ]


exercisesFromTafels : List Int -> List Int -> List Exercise
exercisesFromTafels range tafels =
    List.foldl (exercisesFromTafel range) Dict.empty tafels
        |> Dict.toList
        |> List.map (\( outcome, factors ) -> Exercise outcome factors)


exercisesFromTafel : List Int -> Int -> Dict Int (List Int) -> Dict Int (List Int)
exercisesFromTafel range tafel exercises =
    List.foldl (addExercise tafel) exercises range


addExercise tafel factor exercises =
    Dict.update
        (factor * tafel)
        (Just << Maybe.withDefault [ tafel ] << Maybe.map ((::) tafel))
        exercises
