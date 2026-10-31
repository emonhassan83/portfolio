import { Controller } from "react-hook-form";

const PortfolioTextArea = ({ type, name, label, placeholder, height }) => {
  return (
    <div style={{ marginBottom: "7px", width: "100%" }}>
      <p style={{ marginBottom: "5px", fontSize: "14px" }}>{label ? label : null}</p>
      <Controller
        name={name}
        render={({ field }) => (
          <textarea
            type={type}
            id={name}
            placeholder={placeholder}
            {...field}
            className={`textarea textarea-bordered w-full h-[${height}]`}
          ></textarea>
        )}
      />
    </div>
  );
};

export default PortfolioTextArea;
