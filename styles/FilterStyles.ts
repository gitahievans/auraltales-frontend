import { color } from "framer-motion";

export const customStyles = {
    control: (provided: any) => ({
      ...provided,
      backgroundColor: '#041714', // Background color for the control (input area)
      borderColor: 'white', // Border color for the control
      color: 'white', // Text color
      boxShadow: 'none',
      '&:hover': {
        borderColor: 'green',
        backgroundColor: 'white',
        color: 'black', // Border color on hover
      },
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: 'white', // Text color inside the select
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: '#041714', // Background color for the dropdown menu
    }),


    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#006400' : '#061C19', // Background color for options (darker when selected)
      color: 'white', // Text color for options
      '&:hover': {
        backgroundColor: 'white', // Background color on hover
        color: 'black',
      },
    }),
  };