export var generateRandomString = (length) => {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

export var objectToList = (main_object) => {
  if (main_object === null) return;
  const final = (
    <pre>
      {Object.keys(main_object).map((key, i) => {
        if (typeof main_object[key] !== "object") {
          return (
            <p key={i}>
              <span>{key} : </span>
              <span>{main_object[key].toString()}</span>
            </p>
          );
        } else {
          return (
            <div key={i}>
              <span>{key}:</span>
              <span>{objectToList(main_object[key])}</span>
            </div>
          );
        }
      })}
    </pre>
  );
  return final;
};
