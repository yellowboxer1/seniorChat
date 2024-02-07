import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Image, Alert } from "react-native";
import { AudioRecorder } from "react-native-audio";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import RNFS from "react-native-fs";
import { PermissionsAndroid } from 'react-native';
import { Linking } from 'react-native';

const ChatScreen = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  const [recording, setRecording] = useState(null);
  const [buttonPressCount, setButtonPressCount] = useState(0);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: "안녕하세요, 김실버님. 좋은 아침이에요. 안녕히 주무셨나요?",
        createdAt: new Date(),
        user: {
          _id: 1,
          name: "React Native",
          avatar:require('./icon.png'),
        },
      },
    ]);
  }, []);

  const UserMessages = [
    {
      text: "아파서 잘 못잤어",
      trigger: 'US1',
      user: {
        _id: 'a',
        name: "User",
        avatar: "https://placeimg.com/140/140/any",
      },
    },
    {
      text: "약은 늘 먹지만, 오늘은 병원에 가야겠다",
      trigger: 'US2',      
      user: {
        _id: 'b',
        name: "User",
        avatar: "https://placeimg.com/140/140/any",
      },
    },
    {
      text: "그래 아침만 먹고, 병원 가야겠구나",
      trigger: 'US3',      
      user: {
        _id: 'c',
        name: "User",
        avatar: "https://placeimg.com/140/140/any",
      },
    },
    {
      text: "아침은 뭐 먹으면 좋을까?",
      trigger: 'US4',      
      user: {
        _id: 'z',
        name: "User",
        avatar: "https://placeimg.com/140/140/any",
      },
    },
    {
      text: "그래, 이제 준비해야겠구나",
      trigger: 'US5',      
      user: {
        _id: 'y',
        name: "User",
        avatar: "https://placeimg.com/140/140/any",
      },
    },
  ];

  const AIMessages = [
    {
      text: "약은 드셨어요? 오늘은 푹 쉬세요",
      trigger: 'AI1',
      user: {
        _id: 'd',
        name: "User",
        avatar: "https://placeimg.com/140/140/any",
      },
    },
    {
      text: "괜찮으세요? 약 드셔야 겠어요",
      trigger: 'AI11',
      user: {
        _id: 'd1',
        name: "User",
        avatar: "https://placeimg.com/140/140/any",
      },
    },
    {
      text: "약만 먹는 것보단 병원이 낫죠",
      trigger: 'AI2',      
      user: {
        _id: 'e',
        name: "User",
        avatar: "https://placeimg.com/140/140/any",
      },
    },
    {
      text: "병원을 가 보시는건 어떠세요?",
      trigger: 'AI3',      
      user: {
        _id: 'f',
        name: "User",
        avatar: "https://placeimg.com/140/140/any",
      },
    },
    {
      text: "네 아침은 드시고 가야죠",
      trigger: 'AI4',      
      user: {
        _id: 'g',
        name: "User",
        avatar: "https://placeimg.com/140/140/any",
      },
    },
    {
      text: "아플 땐 따뜻하고 간편한 죽 어떨까요?",
      trigger: 'AI6',      
      user: {
        _id: 'hk',
        name: "User",
        avatar: "https://placeimg.com/140/140/any",
      },
    },
    {
      text: "간단한 과일 챙겨드시는거는 어떠세요?",
      trigger: 'AI7',      
      user: {
        _id: 'i',
        name: "User",
        avatar: "https://placeimg.com/140/140/any",
      },
    },
    {
      text: "네 오늘도 건강하고 좋은 하루 되세요",
      trigger: 'AI8',      
      user: {
        _id: 'j',
        name: "User",
        avatar: "https://placeimg.com/140/140/any",
      },
    },
    {
      text: "잘 알아듣지 못했어요",
      trigger: 'AI5',      
      user: {
        _id: 'h',
        name: "User",
        avatar: "https://placeimg.com/140/140/any",
      },
    },
  ];

  async function requestRecordPermission() {
    try {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('마이크 권한이 허용되었습니다.');
        startRecording();
      } else {
        console.log('마이크 권한이 부여되지 않았습니다.');
        Alert.alert(
          '권한 필요',
          '마이크 권한이 필요합니다. 설정에서 권한을 활성화하세요.',
          [
            {
              text: '확인',
              onPress: () => openAppSettings(),
            },
          ],
          { cancelable: false }
        );
      }
    } catch (err) {
      console.warn(err);
    }
  }
  
  const [nextMessageId, setNextMessageId] = useState(2); // 초기값을 2로 설정

  function openAppSettings() {
    Linking.openSettings();
  }

    // 확률에 따라 메시지 선택
  const selectRandomMessage = (options) => {
    const sumOfProbabilities = options.reduce((sum, option) => sum + option.probability, 0);
    let randomValue = Math.random() * sumOfProbabilities;
    for (const option of options) {
      randomValue -= option.probability;
      if (randomValue < 0) {
        return option.trigger;
      }
    }
    return options[0].trigger;
  };

  async function startRecording() {
    console.log("Preparing for recording");
    const audioPath = `${RNFS.DownloadDirectoryPath}/test.wav`;
    console.log("녹음 파일 경로:", audioPath);

    AudioRecorder.prepareRecordingAtPath(audioPath, {
      SampleRate: 16000,
      Channels: 1,
      AudioQuality: "High",
      AudioEncoding: "wav",
    });

    AudioRecorder.onProgress = (data) => {
      console.log("Recording progress", data);
    };

      await AudioRecorder.startRecording();
      setRecording(true);
      console.log("Recording started");
    }

  // 녹음 종료 후 로직
  async function stopRecording() {
    await AudioRecorder.stopRecording();
    setRecording(false);
    setButtonPressCount((prevCount) => prevCount + 1);

    // 사용자 응답과 관련된 로직 추가
    let nextText, nextTrigger;
    if (buttonPressCount === 0) {
      nextText = "아파서 잘 못잤어";
      nextTrigger = "US1";
    } else if (buttonPressCount === 1) {
      nextText = "약은 늘 먹지만, 오늘은 병원에 가야겠다";
      nextTrigger = "US2";
    } else if (buttonPressCount === 2) {
      nextText = "그래 아침만 먹고, 병원 가야겠구나";
      nextTrigger = "US3";
    } else if (buttonPressCount === 3) {
      nextText = "아침은 뭐 먹으면 좋을까?";
      nextTrigger = "US4";
    } else if (buttonPressCount === 4) {
      nextText = "그래, 이제 준비해야겠구나";
      nextTrigger = "US5";
    }

    const userResponse = {
      _id: nextMessageId,
      text: nextText,
      createdAt: new Date(),
      user: {
        _id: 2,
        name: "User",
        avatar: "https://placeimg.com/140/140/any",
      },
    };

    // 메시지 추가 후 nextMessageId 업데이트
    setMessages((prevMessages) => GiftedChat.append(prevMessages, [{ ...userResponse, _id: nextMessageId }]));
    setNextMessageId(nextMessageId + 1);

    setTimeout(() => {
      let aiTrigger;
      if (nextTrigger === "US1") {
        aiTrigger = selectRandomMessage([
          { trigger: "AI1", probability: 0.6 },
          { trigger: "AI11", probability: 0.4 },
        ]);
      } else if (nextTrigger === "US2") {
        aiTrigger = selectRandomMessage([
          { trigger: "AI2", probability: 0.6 },
          { trigger: "AI3", probability: 0.4 },
        ]);
      } else if (nextTrigger === "US3") {
        aiTrigger = "AI4";
      } else if (nextTrigger === "US4") {
        aiTrigger = "AI7";
      } else if (nextTrigger === "US5") {
        aiTrigger = "AI8";
      }
      if (Math.random() < 0.04) {
        aiTrigger = "AI5";
      }

      const aiMessage = AIMessages.find((message) => message.trigger === aiTrigger);

      const botResponse = {
        _id: nextMessageId + 1,
        text: aiMessage?.text || "버튼을 눌러 말씀해주세요",
        createdAt: new Date(),
        user: {
          _id: 1,
          name: "AI Bot",
          avatar:require('./icon.png'),
        },
      };

      // 메시지 추가 후 nextMessageId 업데이트
      // setMessages((prevMessages) => GiftedChat.append(prevMessages, [botResponse]));
      setMessages((prevMessages) => {
          return GiftedChat.append(prevMessages, [botResponse]
        )
      });
      setNextMessageId("a" + nextMessageId + 1);  
    }, 1500);
  }
  
  function onBack() {
    navigation.navigate("Main");
  }
  function onReload() {
    navigation.navigate("Chat");
  }

  return (
    <SafeAreaView style={[styles.container, {marginTop: -20}]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={{ color: '#ffffff' }}>뒤로</Text>
        </TouchableOpacity>
        <Text style={{ color: '#ffffff', fontSize: 22 }}>AI대화하기</Text>
        <TouchableOpacity onPress={onReload}>
          <Text style={{ color: '#ffffff' }}>다시</Text>
        </TouchableOpacity>
      </View>
      <GiftedChat
        inverted={true}
        messages={messages}
        user={{ _id: 2 }}
        renderInputToolbar={() => null}
        renderBubble={(props) => {
          return (
            <Bubble
              {...props}
              wrapperStyle={{
                right: {
                  backgroundColor: '#FFFFFF',
                  borderRadius: 12,
                },
                left: {
                  backgroundColor: '#FFCAE4',
                  borderRadius: 12,
                },
              }}
              textStyle={{
                right: {
                  color: 'black', // 오른쪽 버블의 텍스트 색상
                },
                left: {
                  color: 'black', // 왼쪽 버블의 텍스트 색상
                }
              }}
            />
          );
        }}
        listViewProps={{
          contentContainerStyle: { marginTop: 150 }
        }} 
      />
      <View style={styles.recordingButton}>
        <TouchableOpacity onPress={recording ? stopRecording : requestRecordPermission}>
          {recording ? (
            <Image
              source={require("./button.gif")} 
              style={{ width: 200, height: 200 }}
            />
          ) : (
            <Image
              source={require("./button.png")} 
              style={{ width: 200, height: 200 }}
            />
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#131635', // 배경색 설정
  },
  header: {
    width: "100%",
    height: "20%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: "400",
  },
  recordingButton: {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    marginLeft: -100,
  },
});

export default ChatScreen;