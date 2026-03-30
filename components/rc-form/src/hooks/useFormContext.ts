import { useContext } from "react"
import FormContext from "../context.js"

const useFormContext = () => {
    return useContext(FormContext)
}

export default useFormContext;