import React, { useRef } from 'react';
import { useScrollBox } from './useScrollBox';
import './scrollBox.css';

export interface ScrollBoxProps {
  showVerticalScrollBar?: boolean,
  showHorizontalScrollBar?: boolean,
  scrollDirection: 'vertical' | 'horizontal' | 'both',
  children: React.ReactNode
}

export const ScrollBox: React.FC<ScrollBoxProps> = ({
  showVerticalScrollBar = false,
  showHorizontalScrollBar = false,
  scrollDirection,
  children
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { isDragging } = useScrollBox(scrollDirection, scrollRef);

  const wrapperClass = function() {
    if (showVerticalScrollBar && showHorizontalScrollBar) {
      return 'scroll-box__wrapper-both';
    }
    else if (showVerticalScrollBar) {
      return 'scroll-box__wrapper-vertical';
    }
    else if (showHorizontalScrollBar) {
      return 'scroll-box__wrapper-horizontal';
    }
    else {
      return 'scroll-box__wrapper-none';
    }
  }();

  return (
    <div className='scroll-box'>
      <div className={wrapperClass} ref={scrollRef}>
        <div className='scroll-box__container' role='list' style={{ pointerEvents: isDragging ? 'none' : undefined }}>
          {
            React.Children.map(children, (child: React.ReactNode, index: number) => (
              <div className="scroll-box__item" role='listitem' key={`scroll-box-item-${index}`}>
                {
                  child
                }
              </div> 
            ))
          }
        </div>
      </div>
    </div>
  );
};