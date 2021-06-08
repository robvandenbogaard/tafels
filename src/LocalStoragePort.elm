port module LocalStoragePort exposing (clear, getItem, listKeys, make, response, setItem)

import LocalStorage exposing (ClearPort, GetItemPort, ListKeysPort, LocalStorage, ResponsePort, SetItemPort)


port getItem : GetItemPort msg


port setItem : SetItemPort msg


port clear : ClearPort msg


port listKeys : ListKeysPort msg


port response : ResponsePort msg


make : String -> LocalStorage msg
make =
    LocalStorage.make getItem setItem clear listKeys
