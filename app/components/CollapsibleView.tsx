// import React, {useCallback, useState} from 'react';
// import {Animated} from 'react-native';
// import styled from 'styled-components/native';
// import IonIcon from 'react-native-vector-icons/Ionicons';
// import {TouchableWithoutFeedback} from 'react-native-gesture-handler';

// const ViewContainer = styled.View`
//   width: 100%;
//   align-self: center;
//   padding: 4px;
//   background-color: lightgray;
//   margin-top: 2px;
//   margin-bottom: 2px;
// `;

// const TitleContainer = styled.View`
//   height: 30px;
//   flex-direction: row;
//   justify-content: space-between;
//   align-items: center;
// `;

// const BodyContianer = styled(Animated.View)`
//   overflow: hidden;
// `;

// const TitleText = styled.Text`
//   font-size: 18px;
//   line-height: 20px;
//   color: black;
// `;

// const BodyText = styled.Text`
//   font-size: 15px;
//   line-height: 17px;
//   color: black;
// `;

// interface ViewProps {
//   sectionTitle: string;
//   content: string;
//   maxLine: number;
// }

// const CollapsibleView = (props: ViewProps) => {
//   const {sectionTitle, content, maxLine} = props;
//   //state 관리
//   const [isFirst, setIsFirst] = useState<boolean>(true);
//   const [isEnableCollapsible, setIsEnableCollapsible] = useState<boolean>(true);

//   const onPress = useCallback(() => {
//     //
//   }, []);

//   const onTextLayout = useCallback(
//     event => {
//       if (isFirst) {
//         const {lines} = event.nativeEvent;

//         if (lines.lengh >= maxLine) {
//           setIsEnableCollapsible(false);
//         }

//         setContentLineCount(lines.length);
//         setContentLineHeight(lines[0].height);
//         contentContainerHeight.value = lines[0].height * maxLine;
//         setIsFirst(false);
//       }
//     },
//     [isFirst],
//   );

//   return (
//     <ViewContainer>
//       <TouchableWithoutFeedback onPress={onPress}>
//         <TitleContainer>
//           <TitleText>{sectionTitle}</TitleText>
//           <Animated.View>
//             <IonIcon name="chevron-down" size={30} />
//           </Animated.View>
//         </TitleContainer>
//       </TouchableWithoutFeedback>
//       <BodyContianer>
//         <BodyText>{content}</BodyText>
//       </BodyContianer>
//     </ViewContainer>
//   );
// };

// export default CollapsibleView;
