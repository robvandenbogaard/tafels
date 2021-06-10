module Main exposing (main)

import Browser
import Browser.Events exposing (onKeyDown)
import Html
import Html.Attributes as Html
import Html.Events as Html
import Json.Decode as Decode
import Json.Encode as Encode
import LocalStorage exposing (LocalStorage)
import LocalStoragePort
import Set exposing (Set)


main : Program () Model Msg
main =
    Browser.document
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }


type alias Model =
    { tafels : Set Int
    , exercises : List Exercise
    , achievements : Achievements
    , report : Report
    , state : State
    , storage : LocalStorage Msg
    }


type alias Exercise =
    ( Int, Int )


type alias Achievements =
    { tafels : Set Int
    , pokeballs : Int
    }


type alias Report =
    { successes : List Exercise
    , fails : List Exercise
    }


type State
    = Load
    | Start
    | Prompt Exercise String
    | CheckedSuccess Exercise
    | CheckedFail Exercise
    | Finish


type Msg
    = Check Int
    | NoCheck Int
    | Input String
    | Next
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


init flags =
    let
        storage =
            LocalStoragePort.make "compurob.nl/tafels"
    in
    ( { tafels = Set.empty
      , exercises = []
      , achievements = Achievements Set.empty 0
      , report = Report [] []
      , state = Load
      , storage = storage
      }
    , LocalStorage.getItem storage "achievements"
    )


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
        [ onKeyDown keyDecoder
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
            let
                _ =
                    Debug.log "NoCheck" <| String.fromInt tafel
            in
            ( model, Cmd.none )

        Next ->
            case model.state of
                Load ->
                    ( model, Cmd.none )

                Start ->
                    if not (Set.isEmpty model.tafels) then
                        advance
                            { model
                                | exercises = exercisesFromTafels (List.range 0 12) (Set.toList model.tafels)
                            }

                    else
                        ( model, Cmd.none )

                Prompt ( n1, n2 ) input ->
                    case String.toInt input of
                        Nothing ->
                            ( model, Cmd.none )

                        Just n ->
                            if n1 * n2 == n then
                                advance <|
                                    { model
                                        | report =
                                            { successes = ( n1, n2 ) :: model.report.successes
                                            , fails = model.report.fails
                                            }
                                    }

                            else
                                advance <|
                                    { model
                                        | report =
                                            { successes = model.report.successes
                                            , fails = ( n1, n2 ) :: model.report.fails
                                            }
                                    }

                CheckedSuccess _ ->
                    advance model

                CheckedFail _ ->
                    advance model

                Finish ->
                    ( { model | tafels = Set.empty, state = Start }, Cmd.none )

        Input input ->
            case model.state of
                Prompt p _ ->
                    ( { model | state = Prompt p input }, Cmd.none )

                _ ->
                    ( model, Cmd.none )

        LocalStorageOp res ->
            case res of
                LocalStorage.Item key value ->
                    let
                        tafelsDecoder =
                            Decode.list Decode.int
                                |> Decode.andThen (Decode.succeed << Set.fromList)

                        achievementsDecoder =
                            Decode.map2 Achievements
                                (Decode.field "tafels" tafelsDecoder)
                                (Decode.field "pokeballs" Decode.int)

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
            ( { model | exercises = exercises, state = Prompt nextExercise "" }, Cmd.none )

        [] ->
            case List.reverse model.report.fails of
                [] ->
                    let
                        achievements =
                            Set.union model.tafels model.achievements.tafels

                        ( pokeballs, newAchievements ) =
                            if (Set.toList <| achievements) == List.range 0 12 then
                                ( model.achievements.pokeballs + 1, Set.empty )

                            else
                                ( model.achievements.pokeballs, achievements )
                    in
                    ( { model
                        | state = Finish
                        , achievements =
                            { tafels = newAchievements
                            , pokeballs = pokeballs
                            }
                      }
                    , [ ( "tafels", Encode.set Encode.int newAchievements )
                      , ( "pokeballs", Encode.int pokeballs )
                      ]
                        |> Encode.object
                        |> LocalStorage.setItem model.storage "achievements"
                    )

                fail :: fails ->
                    ( { model
                        | exercises = fails
                        , state = Prompt fail ""
                        , report = Report model.report.successes []
                      }
                    , Cmd.none
                    )


view model =
    let
        html =
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
                                    [ Html.td [ Html.style "vertical-align" "top" ]
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
                                    , Html.td [ Html.style "width" "60vw", Html.style "vertical-align" "top" ] []
                                    , Html.td [ Html.style "text-align" "right", Html.style "vertical-align" "top" ] <|
                                        List.map
                                            (\_ -> Html.img [ Html.src "pokeball.png", Html.style "padding" "0.5em" ] [])
                                            (List.range 1 model.achievements.pokeballs)
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
                        , Html.p []
                            [ Html.img [ Html.src "https://lorempokemon.fakerapi.it/pokemon" ] []
                            ]
                        ]

                Prompt ( n1, n2 ) input ->
                    Html.div []
                        [ Html.p []
                            [ Html.text <| "Hoeveel is " ++ String.fromInt n1 ++ " x " ++ String.fromInt n2 ++ "?"
                            ]
                        , Html.p []
                            [ Html.input [ Html.onInput Input, Html.autofocus True, Html.pattern "\\d*", Html.value input ] []
                            ]
                        ]

                CheckedSuccess ( n1, n2 ) ->
                    Html.div []
                        [ Html.p []
                            [ Html.text <| String.fromInt n1 ++ " x " ++ String.fromInt n2 ++ " is inderdaad " ++ String.fromInt (n1 * n2) ++ "!"
                            ]
                        , Html.p []
                            [ Html.button [ Html.onClick Next ] [ Html.text "Volgende!" ]
                            ]
                        ]

                CheckedFail ( n1, n2 ) ->
                    Html.div []
                        [ Html.p []
                            [ Html.text <|
                                "Helaas, dat is niet goed. "
                                    ++ String.fromInt n1
                                    ++ " x "
                                    ++ String.fromInt n2
                                    ++ " = "
                                    ++ String.fromInt (n1 * n2)
                                    ++ "!"
                            ]
                        , Html.p []
                            [ Html.button [ Html.onClick Next ] [ Html.text "Volgende!" ]
                            ]
                        ]
    in
    { title = "Sommen"
    , body = [ html ]
    }


exercisesFromTafels : List Int -> List Int -> List ( Int, Int )
exercisesFromTafels range =
    List.concat << List.map (exercisesFromTafel range)


exercisesFromTafel range tafel =
    List.map (\n -> ( n, tafel )) range


randomFloats : Int -> Float -> List Float
randomFloats length seed =
    let
        ( fs, _ ) =
            List.foldl
                (\_ ( rs, x ) ->
                    ( x :: rs, prand x )
                )
                ( [], seed )
                (List.repeat length 0)
    in
    fs


prand seed =
    logisticMap 3.9 seed


logisticMap a x =
    (1 - x) * x * a
