import { FieldError } from "react-hook-form";
import Select from "react-select";
import makeAnimated from "react-select/animated";

type SelectTagProps = {
  data: any[];
  setData: any;
  selectedItems: any[];
  error?: FieldError;
  setValue?: any;
  value?: string;
  text: string;
  placeholder: string;
  displayField: string;
};

const animatedComponents = makeAnimated();

const SelectTag: React.FC<SelectTagProps> = ({
  data,
  setData,
  selectedItems,
  error,
  setValue,
  value,
  text,
  placeholder,
  displayField,
}) => {
  
  const handleChange = (selected: any) => {
    const labels = selected.map((item: any) => item.value);
    setData(selected);
    if (setValue) {
      setValue(value, labels || []);
    }
  };

  return (
    <div>
      <label className="text-green-800 text-base font-medium">{text}</label>
      <div className="mt-1">
        <Select
          isDisabled={selectedItems?.length === 0}
          placeholder={
            selectedItems?.length === 0
              ? `No se requiere ${placeholder}`
              : `Seleccione ${placeholder}`
          }
          components={animatedComponents}
          isMulti
          options={selectedItems?.map((label) => ({
            value: label.id,
            label: label[displayField],
          }))}
          classNamePrefix="custom-select"
          onChange={handleChange}
          closeMenuOnSelect={false}
          required={false}
          value={data}
          styles={{
            control: (provided, state) => ({
              ...provided,
              backgroundColor: "transparent",
              borderColor: state.isFocused ? "#166534" : "#d4d4d8",
              boxShadow: state.isFocused ? "none" : "none",
              borderRadius: "6px",
              paddingBlock: "4px",
              paddingInline: "12px",
              fontSize: "16px",
              color: "#52525b",
            }),
            menu: (provided) => ({
              ...provided,
              zIndex: 9999,
              fontSize: "14px",
              color: "#52525b",
            }),
          }}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
    </div>
  );
};

export default SelectTag;
