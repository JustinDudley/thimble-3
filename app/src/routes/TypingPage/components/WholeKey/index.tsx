import React, { useState } from 'react';
// import { colors } from '../../../../helpers/jsColors'; //save

import classNames from 'classnames';
import styles from './style.module.css';
import { MiniBoxProps, WholeKeyProps } from '../../../../models/WholeKey';

const MiniBox: React.FC<MiniBoxProps> = ({
   bullseyeCounter,
   setBullseyeCounter,
   // keyCounter,
   keyboardCounter,
   miniBoxId,
   gradientRecord,
   setGradientRecord,
   isEasy,
   medallion,
}) => {
   // const numMinisToShow = 3; // save
   // const [miniCounter, setMiniCounter] = useState(0); //save

   const peripheralColumnsMinis = [0, 3, 6, 2, 5, 8];
   const peripheralRowsMinis = [0, 1, 2, 6, 7, 8];

   const numMedallionsToShow = 2;
   const [isClicked, setIsClicked] = useState(false);
   const [keyBoardCounterSnapshot, setKeyboardCounterSnapshot] = useState(0);

   return (
      <div
         // prettier-ignore
         // uncomment style={{... for width testing. CAREFUL, prettier ignore should NOT apply to className block
         // style={{backgroundColor: `#${((miniBoxId + 1) * 3) % 10}${((miniBoxId + 1) * 5) % 10}${((miniBoxId + 1) * 7) % 10}`,}}
         className={classNames(
            styles.miniBox,
            // [brackets] are necessary because this is an object key:
            {
               [styles.miniBoxEasyCentral]: isEasy,
               [styles.miniBoxEasyPeripheralWidth]:
                  isEasy && peripheralColumnsMinis.includes(miniBoxId),
               [styles.miniBoxEasyPeripheralHeight]:
                  isEasy && peripheralRowsMinis.includes(miniBoxId),
            },
            {
               [styles.miniBoxHardCentral]: !isEasy,
               [styles.miniBoxHardPeripheralWidth]:
                  !isEasy && peripheralColumnsMinis.includes(miniBoxId),
               [styles.miniBoxHardPeripheralHeight]:
                  !isEasy && peripheralRowsMinis.includes(miniBoxId),
            },
         )}
         onClick={() => {
            setIsClicked(true);
            setKeyboardCounterSnapshot(keyboardCounter);
            setGradientRecord(() => {
               gradientRecord[miniBoxId] = gradientRecord[miniBoxId] + 1;
               return gradientRecord;
            });
            miniBoxId === 4 && setBullseyeCounter(bullseyeCounter + 1);
            // setMiniCounter(keyCounter); //save
         }}
         // SAVE BELOW:  This sets the colors for my follow-the-leader purple:
         // style={{backgroundColor: isClicked && keyCounter === miniCounter + 1? colors.purpleFeedback : isClicked && keyCounter - (miniCounter + 1) < numMinisToShow? colors.purpleFaded:'inherit'}}
      >
         {isClicked &&
            keyboardCounter - numMedallionsToShow <=
               keyBoardCounterSnapshot && (
               <img
                  src={
                     miniBoxId === 4
                        ? medallion.images.hit
                        : medallion.images.miss
                  }
                  alt="success medallion icon"
                  className={classNames(styles.medallion, {
                     [styles.medallionTrace]:
                        keyboardCounter - 1 !== keyBoardCounterSnapshot,
                  })}
               />
            )}
      </div>
   );
};

export const WholeKey: React.FC<WholeKeyProps> = ({
   bullseyeCounter,
   setBullseyeCounter,
   letter,
   keyboardCounter,
   setKeyboardCounter,
   typedSentence,
   setTypedSentence,
   isEasy,
   medallion,
   isUpperCase,
   setIsUpperCase,
}) => {
   const maxSentenceLength = 100;
   const miniBoxIds = [0, 1, 2, 3, 4, 5, 6, 7, 8];
   // const [keyCounter, setKeyCounter] = useState(0);
   const [gradientRecord, setGradientRecord] = useState([
      0, 0, 0, 0, 0, 0, 0, 0, 0,
   ]);

   const mostPresses = Math.max(...gradientRecord);
   const mostPressedMiniBox = gradientRecord.indexOf(mostPresses);
   const directions = [
      'toLeftTop',
      'toTop',
      'toRightTop',
      'toLeft',
      'noGradient',
      'toRight',
      'toLeftBottom',
      'toBottom',
      'toRightBottom',
   ];

   const buildSentence = () => {
      let localSentence = typedSentence;
      if (localSentence.length >= maxSentenceLength) {
         localSentence = localSentence.substring(1);
      }
      return localSentence + `${isUpperCase ? letter.toUpperCase() : letter}`;
   };

   return (
      <div
         className={classNames(styles.wholeKey, {
            [styles.wholeKeyUpperCase]: letter === '^',
            [styles.wholeKeyBackspace]: letter === '<<',
            [styles.wholeKeySpacebar]: letter === ' ',
         })}
         onClick={() => {
            if (!['<<', '^'].includes(letter)) {
               // setKeyCounter(keyCounter + 1);
               setKeyboardCounter(keyboardCounter + 1);
               setTypedSentence(buildSentence());
               setIsUpperCase(false);
            } else if (letter === '<<') {
               setTypedSentence(typedSentence.slice(0, -1));
               setIsUpperCase(false);
            } else if (letter === '^') {
               setIsUpperCase(!isUpperCase);
            }
         }}
      >
         {!['<<', '^'].includes(letter) &&
            miniBoxIds.map((miniBoxId) => (
               <MiniBox
                  key={miniBoxId}
                  bullseyeCounter={bullseyeCounter}
                  setBullseyeCounter={setBullseyeCounter}
                  miniBoxId={miniBoxId}
                  letter={letter}
                  // keyCounter={keyCounter}
                  keyboardCounter={keyboardCounter}
                  gradientRecord={gradientRecord}
                  setGradientRecord={setGradientRecord}
                  isEasy={isEasy}
                  medallion={medallion}
               />
            ))}
         <div
            className={classNames(
               styles.shownKey,
               {
                  [styles.shownKeyUpperCase]: letter === '^',
                  [styles.highlight]: letter === '^' && isUpperCase,
                  [styles.shownKeyBackspace]: letter === '<<',
                  [styles.shownKeySpacebar]: letter === ' ',
               },
               {
                  [styles[directions[mostPressedMiniBox]]]:
                     letter !== '<<' && letter !== '^',
                  [styles.noGradient]:
                     letter !== '<<' && letter !== '^' && mostPresses === 0,
               },
            )}
         >
            <div
               className={classNames(styles.letter, {
                  [styles.letterUpperCase]: letter === '^',
               })}
            >
               {isUpperCase ? letter.toUpperCase() : letter}
            </div>
         </div>
      </div>
   );
};
