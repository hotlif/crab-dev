import { use } from "react"
import FormContext from "../context.js"

const useFormContext = () => {
    return use(FormContext)
}

export default useFormContext;