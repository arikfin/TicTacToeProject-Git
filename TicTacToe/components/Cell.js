import React, { useEffect } from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

export default function Cell({ value, onPress }) {

  useEffect(() => {
    console.log('Cell re-rendered with value:', value);
  }, [value]);

  let iconName = "";
  let iconColor = "#7DBBC3";

  if (value === "X") {
    iconName = "times";
  } else if (value === "O") {
    iconName = "circle-o";
  }

  return (
    <TouchableOpacity style={styles.cell} onPress={onPress}>
      {iconName ? <Icon name={iconName} size={60} color={iconColor} /> : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cell: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
});


