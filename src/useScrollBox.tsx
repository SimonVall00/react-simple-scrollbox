import { useState, useEffect, useCallback } from 'react';
import throttle from 'lodash/throttle';

export interface UseScrollBox {
  clickStartX: number | undefined,
  scrollStartX: number | undefined,
  isDragging: boolean,
  directionX: number,
  directionY: number,
  momentumX: number,
  momentumY: number,
  lastScrollX: number,
  speedX: number,
  speedY: number
}

const timing = (1 / 60) * 1000;
const decay = (v: number) => v > 0 ? -0.1 * ((1 / timing) ^ 4) + v : 0;

export const useScrollBox = (
  scrollDirection: 'vertical' | 'horizontal' | 'both',
  scrollRef: React.RefObject<HTMLDivElement>
): UseScrollBox => {
  const scrollRefCurrent = scrollRef.current;

  const [isDragging, setIsDragging] = useState<boolean>(false);

  const [clickStartY, setClickStartY] = useState<number | undefined>(undefined);
  const [scrollStartY, setScrollStartY] = useState<number | undefined>(undefined);
  const [lastScrollY, setLastScrollY] = useState<number>(0);

  const [clickStartX, setClickStartX] = useState<number | undefined>(undefined);
  const [scrollStartX, setScrollStartX] = useState<number | undefined>(undefined);
  const [lastScrollX, setLastScrollX] = useState<number>(0);

  const [directionX, setDirectionX] = useState<number>(0);
  const [directionY, setDirectionY] = useState<number>(0);

  const [momentumX, setMomentumX] = useState<number>(0);
  const [momentumY, setMomentumY] = useState<number>(0);

  const [speedX, setSpeedX] = useState<number>(0);
  const [speedY, setSpeedY] = useState<number>(0);

  const handleLastScrollX = useCallback(
    throttle((screenX: number) => {
      setLastScrollX(screenX);
    }, timing),
    []
  );

  const handleLastScrollY = useCallback(
    throttle((screenY: number) => {
      setLastScrollY(screenY);
    }, timing),
    []
  );

  const handleMomentum = useCallback(
    throttle((nextMomentum: [number, number]) => {
      if (nextMomentum[0] > 0) {
        scrollRef.current!.scrollLeft = scrollRef.current!.scrollLeft + nextMomentum[0] * timing * directionX;
      }
      if (nextMomentum[1] > 0) {
        scrollRef.current!.scrollTop = scrollRef.current!.scrollTop + nextMomentum[1] * timing * directionY;
      }
      if (nextMomentum[0] > 0 || nextMomentum[1] > 0) {
        setMomentumX(nextMomentum[0]);
        setMomentumY(nextMomentum[1]);
      }
    }, timing),
    [scrollRefCurrent, directionX, directionY]
  );

  useEffect(() => {
    if ((momentumX > 0.1 || momentumY > 0.1) && !isDragging) {
      handleMomentum([decay(momentumX), decay(momentumY)]);
    }
    else if (isDragging) {
      setMomentumX(speedX);
      setMomentumY(speedY);
    }
    else {
      setDirectionX(0);
      setDirectionY(0);
    }
  }, [
      momentumX,
      momentumY,
      isDragging,
      speedX,
      speedY,
      directionX,
      directionY,
      handleMomentum
    ]);

  useEffect(() => {
    if (scrollRef.current) {
      const handleDragStart = (event: MouseEvent) => {
        if (scrollDirection === 'horizontal' || scrollDirection === 'both') {
          setClickStartX(event.screenX);
          setScrollStartX(scrollRef.current?.scrollLeft);
        }

        if (scrollDirection === 'vertical' || scrollDirection === 'both') {
          setClickStartY(event.screenY);
          setScrollStartY(scrollRef.current?.scrollTop);
        }

        setDirectionX(0);
        setDirectionY(0);
      };

      const handleDragMove = (event: MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();

        if (clickStartX !== undefined && scrollStartX !== undefined && (scrollDirection === 'horizontal' || scrollDirection === 'both')) {
          const touchDelta = clickStartX - event.screenX;
          scrollRef.current!.scrollLeft = scrollStartX + touchDelta;

          if (Math.abs(touchDelta) > 1) {
            setIsDragging(true);
            setDirectionX(touchDelta / Math.abs(touchDelta));
            setSpeedX(Math.abs((lastScrollX - event.screenX) / timing));
            handleLastScrollX(event.screenX);
          }
        }

        if (clickStartY !== undefined && scrollStartY !== undefined && (scrollDirection === 'vertical' || scrollDirection === 'both')) {
          const touchDelta = clickStartY - event.screenY;
          scrollRef.current!.scrollTop = scrollStartY + touchDelta;

          if (Math.abs(touchDelta) > 1) {
            setIsDragging(true);
            setDirectionY(touchDelta / Math.abs(touchDelta));
            setSpeedY(Math.abs((lastScrollY - event.screenY) / timing));
            handleLastScrollY(event.screenY);
          }
        }
      };

      const handleDragEnd = () => {
        if (clickStartX !== undefined || clickStartY !== undefined) {
          setClickStartX(undefined);
          setScrollStartX(undefined);
          setClickStartY(undefined);
          setScrollStartY(undefined);
          setIsDragging(false);
        }
      };

      if (scrollRef.current.ontouchstart === undefined) {
        scrollRef.current.onmousedown = handleDragStart;
        scrollRef.current.onmousemove = handleDragMove;
        scrollRef.current.onmouseup = handleDragEnd;
        scrollRef.current.onmouseleave = handleDragEnd;
      }
    }
  }, [
      scrollRef,
      scrollRefCurrent,
      clickStartX,
      clickStartY,
      scrollStartX,
      scrollStartY,
      isDragging,
      handleLastScrollX,
      handleLastScrollY,
      lastScrollX,
      lastScrollY,
      scrollDirection
    ]);

  return {
    clickStartX,
    scrollStartX,
    isDragging,
    directionX,
    directionY,
    momentumX,
    momentumY,
    lastScrollX,
    speedX,
    speedY
  };
};