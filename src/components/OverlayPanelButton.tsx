import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { OverlayPanel } from "primereact/overlaypanel";
import { useRef } from "react";

const OverlayPanelButton = () => {
  const op = useRef(null);
  return (
    <div>
      <Button
        type='button'
        icon='pi pi-chevron-down'
        onClick={(e) => op.current.toggle(e)}
      />

      <OverlayPanel ref={op}>
        <div className='flex flex-column gap-3 align-items-end'>
          <InputText keyfilter='int' placeholder='Select Rows' />
          <Button label='Submit' outlined   />
        </div>
      </OverlayPanel>
    </div>
  );
};

export default OverlayPanelButton;
