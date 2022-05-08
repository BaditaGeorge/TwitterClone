export default function FormBodyWrapper(props) {
    return <div
    style={{
      backgroundColor: "white",
      width: "100%",
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    }}
  >
      {props.children}
  </div>;
};