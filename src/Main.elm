module Main exposing (main)

import Browser
import Browser.Events exposing (onKeyDown)
import Html
import Html.Attributes as Html
import Html.Events as Html
import Json.Decode as Decode
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
            LocalStoragePort.make "compurob.nl/tafels:"
    in
    ( { tafels = Set.empty
      , exercises = []
      , achievements = Achievements Set.empty
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
    let
        nextModel =
            case msg of
                Check tafel ->
                    { model
                        | tafels =
                            if Set.member tafel model.tafels then
                                Set.remove tafel model.tafels

                            else
                                Set.insert tafel model.tafels
                    }

                Next ->
                    case model.state of
                        Load ->
                            model

                        Start ->
                            if not (Set.isEmpty model.tafels) then
                                advance
                                    { model
                                        | exercises = exercisesFromTafels (List.range 0 12) (Set.toList model.tafels)
                                    }

                            else
                                model

                        Prompt ( n1, n2 ) input ->
                            case String.toInt input of
                                Nothing ->
                                    model

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
                            model

                Input input ->
                    case model.state of
                        Prompt p _ ->
                            { model | state = Prompt p input }

                        _ ->
                            model

                LocalStorageOp res ->
                    case res of
                        LocalStorage.Item key value ->
                            { model | state = Start }

                        LocalStorage.ItemNotFound key ->
                            { model | state = Start }

                        LocalStorage.KeyList keys ->
                            { model | state = Start }

                        LocalStorage.Error errMsg ->
                            { model | state = Start }
    in
    ( nextModel, Cmd.none )


advance model =
    case model.exercises of
        nextExercise :: exercises ->
            { model | exercises = exercises, state = Prompt nextExercise "" }

        [] ->
            case List.reverse model.report.fails of
                [] ->
                    { model | state = Finish }

                fail :: fails ->
                    { model
                        | exercises = fails
                        , state = Prompt fail ""
                        , report = Report model.report.successes []
                    }


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
                            [ Html.table [] <|
                                List.map
                                    (\tafel ->
                                        Html.tr []
                                            [ Html.td []
                                                [ Html.input
                                                    [ Html.type_ "checkbox"
                                                    , Html.onClick <| Check tafel
                                                    , Html.checked <|
                                                        Set.member tafel model.tafels
                                                            || Set.member tafel model.achievements.tafels
                                                    , Html.readonly <|
                                                        Set.member tafel model.achievements.tafels
                                                    ]
                                                    []
                                                ]
                                            , Html.td [] [ Html.text <| String.fromInt tafel ]
                                            ]
                                    )
                                    (List.range 0 12)
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
