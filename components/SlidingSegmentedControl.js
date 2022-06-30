import { Box, Flex } from '@chakra-ui/react'
import { useState } from 'react'

export const SlidingSegmentedControl = ({ options, selectedValue, setSelectedValue }) => {
  const [selectedIndex, setSelectedIndex] = useState(options.map(option => option.value).indexOf(selectedValue))
  const optionWidth = `${100 / options.length}%`

  const onClick = (index) => {
    setSelectedIndex(index)
    setSelectedValue(options[index].value)
  }
  return (
    // Frame
    <Flex justifyContent="space-around" alignItems="center" w="full" borderRadius={6} bg="#1c1c1e" color="white" position="relative">
      {options.map(({ value }, index) => index !== options.length - 1 && (
        // Divider
        <Box
          position="absolute"
          key={`divider-${value}`}
          left={`calc( ${optionWidth} * ${index + 1 } )`}
          h="55%"
          w="1px"
          bg="gray.600"
        />
      ))}
      {/* Background Frame */}
      <Box
        transition=".4s"
        left={`calc( ${selectedIndex} * ${optionWidth} )`}
        top={0}
        position="absolute"
        w={`calc( ${optionWidth} )`}
        h="100%"
        p="1"
      >
        {/* Background */}
        <Box
          borderRadius={6}
          bg="blackAlpha.500"
          h="100%"
        />
      </Box>
      {options.map(({ value, label }, index) => (
        // Option
        <Flex
          fontSize="xl"
          w="100%"
          alignItems="center"
          justifyContent="center"
          key={`option-${value}`}
          position="relative"
          onClick={() => onClick(index)}
          cursor="pointer"
          px="2"
          py="1"
        >
          {label}
        </Flex>
      ))}
    </Flex>)
}
