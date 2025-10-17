import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { OverlayPanel } from "primereact/overlaypanel";
import { useRef, useState } from "react";

interface OverlayPanelButtonProps {
  onSubmit: (value: number) => void;
}

const OverlayPanelButton = ({ onSubmit }: OverlayPanelButtonProps) => {
  const [inputValue, setInputValue] = useState("");
  const op = useRef(null);

  const handleSubmit = (e: React.MouseEvent) => {
    const numValue = parseInt(inputValue);
    if (!isNaN(numValue) && numValue > 0) {
      onSubmit(numValue);
    }
    op.current.toggle(e);
  };

  return (
    <div>
      <Button
        type='button'
        icon='pi pi-chevron-down'
        onClick={(e) => op.current.toggle(e)}
      />

      <OverlayPanel ref={op}>
        <div className='flex flex-column gap-3 align-items-end'>
          <InputText
            keyfilter='int'
            placeholder='Select Rows'
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <Button label='Submit' outlined onClick={handleSubmit} />
        </div>
      </OverlayPanel>
    </div>
  );
};

export default OverlayPanelButton;