import _get from "lodash.get"
import _set from "lodash.set"
import { mapProps, compose } from "recompose"
import { withFormik } from "formik"

function unflatten(obj){
  return Object.keys(obj).reduce(
    (out, key) => _set(out, key, obj[key]), {}
  )
}

const addFormToProps = props => {
  const {values, setValues, errors, touched} = props
  
  const newErrors = unflatten(errors)
  const newTouched = unflatten(touched)

  return {
    ...props,
    form: {
      $: (name, realInput=false) => ({
        name,
        value: _get(values, name) || (realInput ? "" : undefined),
        onChange: e => setValues(_set(values, name, e.target.value)),
        ...(realInput ? {} : {
          error: _get(newErrors, name),
          touched: _get(newTouched, name)
        })
      }),
      values,
      touched,
      errors
    }
  }
}

export default args => compose(
  withFormik(args),
  mapProps(addFormToProps)
)

