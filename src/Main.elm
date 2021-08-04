module Main exposing (main)

import Browser
import Browser.Events exposing (onKeyDown)
import Html
import Html.Attributes as HtmlAttr
import Html.Events as Html
import Json.Decode as Decode
import Json.Encode as Encode
import LocalStorage exposing (LocalStorage)
import LocalStoragePort
import PokeSums
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


type Model
    = Menu
    | PokeSums PokeSums.Model


type Msg
    = SelectPokeSums
    | PokeSumsMsg PokeSums.Msg


init flags =
    ( Menu
    , Cmd.none
    )


subscriptions : Model -> Sub Msg
subscriptions model =
    case model of
        Menu ->
            Sub.none

        PokeSums pokesums ->
            Sub.map PokeSumsMsg <| PokeSums.subscriptions pokesums


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case model of
        Menu ->
            ( model, Cmd.none )

        PokeSums pokesums ->
            case msg of
                PokeSumsMsg m ->
                    let
                        ( pokesumsModel, pokesumsCmd ) =
                            PokeSums.update m pokesums
                    in
                    ( PokeSums pokesumsModel, Cmd.map PokeSumsMsg pokesumsCmd )

                _ ->
                    ( model, Cmd.none )


view model =
    case model of
        Menu ->
            { title = "Spellen met tafels"
            , body =
                [ Html.h1 [] [ Html.text "Tafels" ]
                , Html.ul []
                    [ Html.li
                        [ Html.onClick SelectPokeSums ]
                        [ Html.text "PokeSommen" ]
                    ]
                ]
            }

        PokeSums pokesums ->
            { title = "PokeSommen"
            , body = [ Html.map PokeSumsMsg <| PokeSums.view pokesums ]
            }
