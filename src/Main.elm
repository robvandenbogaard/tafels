module Main exposing (main)

import Browser
import Game.PokeSums as PokeSums
import Game.ShootOut as ShootOut
import Html
import Html.Attributes as HtmlAttr
import Html.Events as Html


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
    | ShootOut ShootOut.Model


type Msg
    = SelectPokeSums
    | SelectShootOut
    | PokeSumsMsg PokeSums.Msg
    | ShootOutMsg ShootOut.Msg


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

        ShootOut shootout ->
            Sub.map ShootOutMsg <| ShootOut.subscriptions shootout


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case model of
        Menu ->
            case msg of
                SelectPokeSums ->
                    let
                        ( m, c ) =
                            PokeSums.init
                    in
                    ( PokeSums m, Cmd.map PokeSumsMsg c )

                SelectShootOut ->
                    let
                        ( m, c ) =
                            ShootOut.init
                    in
                    ( ShootOut m, Cmd.map ShootOutMsg c )

                _ ->
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

        ShootOut shootout ->
            case msg of
                ShootOutMsg m ->
                    let
                        ( shootoutModel, shootoutCmd ) =
                            ShootOut.update m shootout
                    in
                    ( ShootOut shootoutModel, Cmd.map ShootOutMsg shootoutCmd )

                _ ->
                    ( model, Cmd.none )


view model =
    case model of
        Menu ->
            { title = "Spellen met tafels"
            , body =
                [ Html.h1 [] [ Html.text "Tafels" ]
                , Html.nav []
                    [ Html.p
                        [ Html.onClick SelectPokeSums ]
                        [ Html.text "PokeSommen" ]
                    , Html.p
                        [ Html.onClick SelectShootOut ]
                        [ Html.text "Shootout" ]
                    ]
                ]
            }

        PokeSums pokesums ->
            { title = "Tafels - PokeSommen"
            , body = [ Html.map PokeSumsMsg <| PokeSums.view pokesums ]
            }

        ShootOut shootout ->
            { title = "Tafels - Shootout"
            , body = [ Html.map ShootOutMsg <| ShootOut.view shootout ]
            }
