import { atom } from "recoil"

const initialAuthState = {
    type: "login"
}

export const authModelState = atom({
    key: "authModelState",
    default: initialAuthState
})