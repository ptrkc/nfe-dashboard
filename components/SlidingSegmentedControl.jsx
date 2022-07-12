import { useState } from 'react';

export default function SlidingSegmentedControl({ options, selectedValue, setSelectedValue }) {
  const [selectedIndex, setSelectedIndex] = useState(
    options.map((option) => option.value).indexOf(selectedValue),
  );
  const optionWidth = 100 / options.length;
  const optionLeft = selectedIndex * optionWidth;

  const onClick = (index) => {
    setSelectedIndex(index);
    setSelectedValue(options[index].value);
  };
  return (
    // Frame
    <div className="flex justify-around items-center w-full rounded-md relative bg-black/20">
      <div className="absolute w-full top-0 bottom-0 right-0 left-0 flex justify-evenly items-center">
        {options.map(({ value }, index) => index !== options.length - 1 && (
        // Divider
        <div key={`divider-${value}`} className="h-[55%] w-[1px] bg-black/20" />
        ))}
      </div>
      {/* Background Frame */}
      <div
        style={{ left: `${optionLeft}%`, width: `${optionWidth}%` }}
        className="p-1 h-full absolute top-0 duration-300"
      >
        {/* Background */}
        <div className="rounded-md h-full border shadow-md bg-white" />
      </div>
      {options.map(({ value, label }, index) => (
        // Option
        <button
          type="button"
          key={`option-${value}`}
          onClick={() => onClick(index)}
          className="py-1 px-2 cursor-pointer relative flex justify-center items-center w-full text-lg text-gray-900"
        >
          {label}
        </button>
      ))}
    </div>
  );
}
