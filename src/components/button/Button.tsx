type Props={
    value:string;
    type?:"submit"|"button";
}

const Button = ({value,type}:Props) => {
  return (
    <button
    type={type ?? "button"}
    >
       {value}
    </button>
  )
}

export default Button
