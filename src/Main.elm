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
import Time


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
    , time : Int
    }


type alias Exercise =
    ( Int, Int )


type alias Achievements =
    { tafels : Set Int
    , pokeballs : Int
    , fruits : FruitBag
    }


type alias FruitBag =
    { razzBerries : Int
    , nanabBerries : Int
    , pinapBerries : Int
    , goldenRazzBerries : Int
    , silverPinapBerries : Int
    }


type Fruit
    = RazzBerry
    | NanabBerry
    | PinapBerry
    | GoldenRazzBerry
    | SilverPinapBerry


treeForExercise ( _, tafel ) =
    case tafel of
        0 ->
            []

        1 ->
            []

        2 ->
            [ RazzBerry ]

        3 ->
            [ NanabBerry, RazzBerry ]

        4 ->
            [ NanabBerry, RazzBerry ]

        5 ->
            [ RazzBerry ]

        6 ->
            [ GoldenRazzBerry, SilverPinapBerry, PinapBerry, NanabBerry, RazzBerry ]

        7 ->
            [ GoldenRazzBerry, SilverPinapBerry, PinapBerry, NanabBerry, RazzBerry ]

        8 ->
            [ GoldenRazzBerry, SilverPinapBerry, PinapBerry, NanabBerry, RazzBerry ]

        9 ->
            [ GoldenRazzBerry, SilverPinapBerry, PinapBerry, NanabBerry, RazzBerry ]

        10 ->
            [ RazzBerry ]

        11 ->
            [ PinapBerry, NanabBerry, RazzBerry ]

        12 ->
            [ GoldenRazzBerry, SilverPinapBerry, PinapBerry, NanabBerry, RazzBerry ]

        _ ->
            []


fruitImage fruit =
    case fruit of
        RazzBerry ->
            "GO_Razz_Berry.png"

        NanabBerry ->
            "GO_Nanab_Berry.png"

        PinapBerry ->
            "GO_Pinap_Berry.png"

        GoldenRazzBerry ->
            "GO_Golden_Razz_Berry.png"

        SilverPinapBerry ->
            "GO_Silver_Pinap_Berry.png"


fruitName fruit =
    case fruit of
        RazzBerry ->
            "ズリのみ"

        NanabBerry ->
            "ナナのみ"

        PinapBerry ->
            "パイルのみ"

        GoldenRazzBerry ->
            "きんのズリのみ"

        SilverPinapBerry ->
            "ぎんのパイルのみ"


fruitFromName name =
    case name of
        "ズリのみ" ->
            Just RazzBerry

        "ナナのみ" ->
            Just NanabBerry

        "パイルのみ" ->
            Just PinapBerry

        "きんのズリのみ" ->
            Just GoldenRazzBerry

        "ぎんのパイルのみ" ->
            Just SilverPinapBerry

        _ ->
            Nothing


translations original =
    case original of
        "ズリのみ" ->
            ( "Zuri Fruit", "Razz Berry" )

        "ナナのみ" ->
            ( "Nana Fruit", "Nanab Berry" )

        "パイルのみ" ->
            ( "Pairu Fruit", "Pinap Berry" )

        "きんのズリのみ" ->
            ( "Gold Zuri Fruit", "Gold Razz Berry" )

        "ぎんのパイルのみ" ->
            ( "Silver Pairu Fruit", "Silver Pinap Berry" )

        unknown ->
            ( unknown, unknown )


type alias Report =
    { successes : List Exercise
    , fails : List Exercise
    }


type State
    = Load
    | Start
    | Prompt Exercise String Tree Int
    | CheckedSuccess Exercise
    | CheckedFail Exercise
    | Finish


type alias Tree =
    List Fruit


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


init flags =
    let
        storage =
            LocalStoragePort.make "tafels"
    in
    ( { tafels = Set.empty
      , exercises = []
      , achievements = Achievements Set.empty 0 (FruitBag 0 0 0 0 0)
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

                Prompt ( n1, n2 ) input tree _ ->
                    case String.toInt input of
                        Nothing ->
                            ( model, Cmd.none )

                        Just n ->
                            if n1 * n2 == n then
                                let
                                    incrementFruit fruit fruits =
                                        case fruit of
                                            RazzBerry ->
                                                { fruits | razzBerries = fruits.razzBerries + 1 }

                                            NanabBerry ->
                                                { fruits | nanabBerries = fruits.nanabBerries + 1 }

                                            PinapBerry ->
                                                { fruits | pinapBerries = fruits.pinapBerries + 1 }

                                            GoldenRazzBerry ->
                                                { fruits | goldenRazzBerries = fruits.goldenRazzBerries + 1 }

                                            SilverPinapBerry ->
                                                { fruits | silverPinapBerries = fruits.silverPinapBerries + 1 }
                                in
                                advance <|
                                    { model
                                        | report =
                                            { successes = ( n1, n2 ) :: model.report.successes
                                            , fails = model.report.fails
                                            }
                                        , achievements =
                                            { tafels = model.achievements.tafels
                                            , pokeballs = model.achievements.pokeballs
                                            , fruits =
                                                List.foldl
                                                    incrementFruit
                                                    model.achievements.fruits
                                                    tree
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
                Prompt p _ t start ->
                    ( { model | state = Prompt p input t start }, Cmd.none )

                _ ->
                    ( model, Cmd.none )

        Tick posix ->
            let
                millis =
                    Time.posixToMillis posix
            in
            case model.state of
                Prompt p i (fruit :: fruits) start ->
                    if millis - start > 1000 then
                        ( { model | time = millis, state = Prompt p i fruits millis }, Cmd.none )

                    else
                        ( { model | time = millis, state = Prompt p i (fruit :: fruits) start }, Cmd.none )

                _ ->
                    ( { model | time = millis }, Cmd.none )

        LocalStorageOp res ->
            case res of
                LocalStorage.Item key value ->
                    let
                        tafelsDecoder =
                            Decode.list Decode.int
                                |> Decode.andThen (Decode.succeed << Set.fromList)

                        fruitsDecoder =
                            Decode.map5 FruitBag
                                (Decode.field "RazzBerries" Decode.int)
                                (Decode.field "NanabBerries" Decode.int)
                                (Decode.field "PinapBerries" Decode.int)
                                (Decode.field "GoldenRazzBerries" Decode.int)
                                (Decode.field "SilverPinapBerries" Decode.int)

                        achievementsDecoder =
                            Decode.map3 Achievements
                                (Decode.field "tafels" tafelsDecoder)
                                (Decode.field "pokeballs" Decode.int)
                                (Decode.field "fruits" fruitsDecoder)

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
            ( { model | exercises = exercises, state = Prompt nextExercise "" (treeForExercise nextExercise) model.time }, Cmd.none )

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
                            , pokeballs = pokeballs
                            , fruits = model.achievements.fruits
                            }
                      }
                    , [ ( "tafels", Encode.set Encode.int newAchievements )
                      , ( "pokeballs", Encode.int pokeballs )
                      , ( "fruits", fruitsEncoder model.achievements.fruits )
                      ]
                        |> Encode.object
                        |> LocalStorage.setItem model.storage "achievements"
                    )

                fail :: fails ->
                    ( { model
                        | exercises = fails
                        , state = Prompt fail "" [] model.time
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
                                    , Html.td [ Html.style "width" "60vw", Html.style "vertical-align" "top" ] <|
                                        List.map
                                            (\( fruitFun, fruit ) ->
                                                Html.div [ Html.style "text-align" "left" ] <|
                                                    [ Html.img [ Html.src <| fruitImage fruit, Html.style "height" "10vh" ] []
                                                    , Html.text <| String.fromInt (fruitFun model.achievements.fruits)

                                                    --, Html.text " "
                                                    --, Html.text <| fruitName fruit
                                                    ]
                                            )
                                            [ ( .goldenRazzBerries, GoldenRazzBerry )
                                            , ( .silverPinapBerries, SilverPinapBerry )
                                            , ( .pinapBerries, PinapBerry )
                                            , ( .nanabBerries, NanabBerry )
                                            , ( .razzBerries, RazzBerry )
                                            ]
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

                Prompt ( n1, n2 ) input tree _ ->
                    Html.div []
                        [ Html.p []
                            [ Html.text <| "Hoeveel is " ++ String.fromInt n1 ++ " x " ++ String.fromInt n2 ++ "?"
                            ]
                        , Html.p []
                            [ Html.input [ Html.onInput Input, Html.autofocus True, Html.pattern "\\d*", Html.value input ] []
                            ]
                        , viewTree tree
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


viewTree tree =
    let
        prand seed =
            Debug.log "rand" <| 3.95 * seed * (1.0 - seed)

        randcoords fruit ( cs, seed ) =
            let
                r1 =
                    seed

                r2 =
                    prand r1
                        |> prand

                r3 =
                    prand r2
                        |> prand
                        |> prand
            in
            ( ( r1, r2, fruit ) :: cs, r3 )

        coords =
            Tuple.first <|
                List.foldl randcoords ( [], 0.3625634 ) tree
    in
    Html.div [ Html.style "position" "relative", Html.style "display" "inline-block" ] <|
        Html.img [ Html.src "SwSh_Berry_tree.png", Html.style "height" "50vh" ] []
            :: List.map viewFruit coords


viewFruit ( x, y, fruit ) =
    Html.img
        [ Html.src <| fruitImage fruit
        , Html.style "height" "7vh"
        , Html.style "position" "absolute"
        , Html.style "top" (String.fromInt (floor <| 7 + 40 * y) ++ "%")
        , Html.style "left" (String.fromInt (floor <| 12 + 50 * x) ++ "%")
        ]
        []


exercisesFromTafels : List Int -> List Int -> List ( Int, Int )
exercisesFromTafels range =
    List.concat << List.map (exercisesFromTafel range)


exercisesFromTafel range tafel =
    List.map (\n -> ( n, tafel )) range
