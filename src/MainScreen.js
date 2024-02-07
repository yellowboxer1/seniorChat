import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Image
} from "react-native";

const MainScreen = ({ navigation }) => {

  
  function onStart() {
    navigation.navigate("Chat");
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleWrapper}>
        <Text style={styles.title1}>AI대화하기</Text>
        <Text style={styles.title2}>AI채팅이 시작되었습니다.</Text>
      </View>
      <View style={styles.buttonWrapper}>
        <TouchableOpacity style={styles.button} onPress={onStart}>
          <Image
           source={require('./button.png')} 
           style={styles.buttonImage}
          /> 
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default MainScreen;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#131635"
  },
  titleWrapper: {
    width: "100%",
    height: "55%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#131635"
  },
  buttonWrapper: {
    width: "100%",
    height: "45%",
    alignItems: "center",
    paddingTop: 120,
    backgroundColor: "#131635"
  },
  title1: {
    fontSize: 35,
    color:'white',
  },
  title2: {
    fontSize: 20,
    color:'white',
  },
  buttonImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain'
  },
});