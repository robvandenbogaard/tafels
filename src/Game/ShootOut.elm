module Game.ShootOut exposing (Model, Msg, init, subscriptions, update, view)

import Browser
import Browser.Events exposing (onKeyDown)
import Dict exposing (Dict)
import Html
import Html.Attributes as Html
import Html.Events as Html
import Json.Decode as Decode
import Json.Encode as Encode
import LocalStorage exposing (LocalStorage)
import LocalStoragePort
import Set exposing (Set)
import Time


type alias Model =
    { tafels : Set Int
    , exercises : List Exercise
    , achievements : Achievements
    , report : Report
    , state : State
    , storage : LocalStorage Msg
    , time : Int
    }


type alias Exercise =
    ( Int, List Int )


type alias Achievements =
    { tafels : Set Int }


type alias Report =
    { successes : List Answer
    , fails : List Answer
    }


type alias Answer =
    { exercise : Exercise
    , answer : Int
    }


type State
    = Load
    | Start
    | Prompt Exercise String Int
    | CheckedSuccess Answer
    | CheckedFail Answer
    | Finish


type Msg
    = Check Int
    | NoCheck Int
    | Input String
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
    ( { tafels = Set.empty
      , exercises = []
      , achievements = Achievements Set.empty
      , report = Report [] []
      , state = Load
      , storage = storage
      , time = 0
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
        Check tafel ->
            ( { model
                | tafels =
                    if Set.member tafel model.tafels then
                        Set.remove tafel model.tafels

                    else
                        Set.insert tafel model.tafels
              }
            , Cmd.none
            )

        NoCheck tafel ->
            ( model, Cmd.none )

        Next ->
            case model.state of
                Load ->
                    ( model, Cmd.none )

                Start ->
                    if not (Set.isEmpty model.tafels) then
                        advance
                            (Debug.log
                                "model"
                                { model
                                    | exercises = exercisesFromTafels (List.range 0 12) (Set.toList model.tafels)
                                }
                            )

                    else
                        ( model, Cmd.none )

                Prompt (( outcome, factors ) as exercise) input _ ->
                    case String.toInt input of
                        Nothing ->
                            ( model, Cmd.none )

                        Just n ->
                            if List.member n factors then
                                { model
                                    | report =
                                        { successes = Answer exercise n :: model.report.successes
                                        , fails = model.report.fails
                                        }
                                    , achievements =
                                        { tafels = model.achievements.tafels
                                        }
                                }
                                    |> advance

                            else
                                { model
                                    | report =
                                        { successes = model.report.successes
                                        , fails = Answer exercise n :: model.report.fails
                                        }
                                }
                                    |> advance

                CheckedSuccess _ ->
                    advance model

                CheckedFail _ ->
                    advance model

                Finish ->
                    ( { model | tafels = Set.empty, state = Start }, Cmd.none )

        Input input ->
            case model.state of
                Prompt p _ start ->
                    ( { model | state = Prompt p input start }, Cmd.none )

                _ ->
                    ( model, Cmd.none )

        Tick posix ->
            let
                millis =
                    Time.posixToMillis posix
            in
            case model.state of
                Prompt p i start ->
                    if millis - start > 1000 then
                        ( { model | time = millis, state = Prompt p i millis }, Cmd.none )

                    else
                        ( { model | time = millis, state = Prompt p i start }, Cmd.none )

                _ ->
                    ( { model | time = millis }, Cmd.none )

        LocalStorageOp res ->
            case res of
                LocalStorage.Item key value ->
                    let
                        tafelsDecoder =
                            Decode.list Decode.int
                                |> Decode.andThen (Decode.succeed << Set.fromList)

                        achievementsDecoder =
                            Decode.map Achievements
                                (Decode.field "tafels" tafelsDecoder)

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
    case model.exercises of
        nextExercise :: exercises ->
            ( { model | exercises = exercises, state = Prompt nextExercise "" model.time }, Cmd.none )

        [] ->
            case List.reverse model.report.fails of
                [] ->
                    let
                        achievements =
                            Set.union model.tafels model.achievements.tafels

                        newAchievements =
                            if (Set.toList <| achievements) == List.range 0 12 then
                                Set.empty

                            else
                                achievements

                        fruitsEncoder fruits =
                            Encode.object
                                [ ( "RazzBerries", Encode.int fruits.razzBerries )
                                , ( "NanabBerries", Encode.int fruits.nanabBerries )
                                , ( "PinapBerries", Encode.int fruits.pinapBerries )
                                , ( "GoldenRazzBerries", Encode.int fruits.goldenRazzBerries )
                                , ( "SilverPinapBerries", Encode.int fruits.silverPinapBerries )
                                ]
                    in
                    ( { model
                        | state = Finish
                        , achievements =
                            { tafels = newAchievements
                            }
                      }
                    , [ ( "tafels", Encode.set Encode.int newAchievements )
                      ]
                        |> Encode.object
                        |> LocalStorage.setItem model.storage "achievements"
                    )

                fail :: fails ->
                    ( { model
                        | exercises = List.map .exercise fails
                        , state = Prompt fail.exercise "" model.time
                        , report = Report model.report.successes []
                      }
                    , Cmd.none
                    )


view model =
    case model.state of
        Load ->
            Html.p [] [ Html.text "Momentje.." ]

        Start ->
            Html.div []
                [ Html.p []
                    [ Html.text <| "Klaar voor de start? Welke tafels wil je doen?"
                    ]
                , Html.p []
                    [ Html.table [ Html.style "width" "100%" ] <|
                        [ Html.tr []
                            [ Html.td [ Html.style "vertical-align" "top", Html.style "width" "5em" ]
                                [ Html.table [] <|
                                    List.map
                                        (\tafel ->
                                            Html.tr []
                                                [ Html.td []
                                                    [ Html.input
                                                        [ Html.type_ "checkbox"
                                                        , Html.onClick <|
                                                            if Set.member tafel model.achievements.tafels then
                                                                NoCheck tafel

                                                            else
                                                                Check tafel
                                                        , Html.checked <|
                                                            Set.member tafel model.tafels
                                                                || Set.member tafel model.achievements.tafels
                                                        , Html.disabled <|
                                                            Set.member tafel model.achievements.tafels
                                                        ]
                                                        []
                                                    ]
                                                , Html.td [] [ Html.text <| String.fromInt tafel ]
                                                ]
                                        )
                                        (List.range 0 12)
                                ]
                            ]
                        ]
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

        Prompt ( outcome, factors ) input _ ->
            Html.div []
                [ Html.p []
                    [ Html.text <| "Uit welke tafel(s) komt " ++ String.fromInt outcome ++ "?"
                    ]
                , Html.p []
                    [ Html.input [ Html.onInput Input, Html.autofocus True, Html.pattern "\\d*", Html.value input ] []
                    ]
                ]

        CheckedSuccess { exercise, answer } ->
            Html.div []
                [ Html.p []
                    [ Html.text <| "De tafel van " ++ String.fromInt answer ++ " bevat inderdaad de uitkomst " ++ String.fromInt (Tuple.first exercise) ++ "!"
                    ]
                , Html.p []
                    [ Html.button [ Html.onClick Next ] [ Html.text "Volgende!" ]
                    ]
                ]

        CheckedFail { exercise } ->
            Html.div []
                [ Html.p []
                    [ Html.text <|
                        "Helaas, dat is niet goed. "
                            ++ String.fromInt (Tuple.first exercise)
                            ++ " is een uitkomst van de tafel(s) van "
                            ++ String.join " en " (List.map String.fromInt (Tuple.second exercise))
                            ++ "!"
                    ]
                , Html.p []
                    [ Html.button [ Html.onClick Next ] [ Html.text "Volgende!" ]
                    ]
                ]


exercisesFromTafels : List Int -> List Int -> List Exercise
exercisesFromTafels range tafels =
    List.foldl (exercisesFromTafel range) Dict.empty tafels
        |> Dict.toList


exercisesFromTafel : List Int -> Int -> Dict Int (List Int) -> Dict Int (List Int)
exercisesFromTafel range tafel exercises =
    List.foldl (addExercise tafel) exercises range


addExercise tafel factor exercises =
    Dict.update
        (factor * tafel)
        (Just << Maybe.withDefault [ tafel ] << Maybe.map ((::) tafel))
        exercises
