import { Controller } from "react-hook-form";

const PortfolioInput = ({ type, name, label, placeholder, defaultValue, setValue }) => {
  return (
    <div style={{ marginBottom: "16px", width: "100%" }}>
      <p style={{ marginBottom: "7px", fontSize: "14px" }}>{label ? label : null}</p>
      <Controller
        name={name}
        render={({ field }) => (
          <input
            type={type}
            id={name}
            placeholder={placeholder}
            defaultValue={defaultValue}
            onBlur={(e) => setValue(name, e.target.value)}
            {...field}
            className="input input-bordered input-sm w-full"
          />
        )}
      />
    </div>
  );
};

export default PortfolioInput;
