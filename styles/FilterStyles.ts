export const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: '#041714', // Background color for the control (input area)
      borderColor: 'green', // Border color for the control
      color: 'white', // Text color
      boxShadow: 'none',
      '&:hover': {
        borderColor: 'green', // Border color on hover
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: 'white', // Text color inside the select
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: '#041714', // Background color for the dropdown menu
    }),

    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#006400' : '#061C19', // Background color for options (darker when selected)
      color: 'white', // Text color for options
      '&:hover': {
        backgroundColor: 'white', // Background color on hover
        color: 'black',
      },
    }),
  };