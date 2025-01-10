"use client";
import Container from "@/components/Container";
import Icon from "@/components/Icon/icon";
import { useEffect, useReducer } from "react";
import {
  Windows,
  WINDOW_COMPONENTS,
  WINDOW_ICONS,
} from "@/components/constants";
import { initialState, loadState, reducer } from "./manager";

export default function Home() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const loadedState = loadState();
    if (loadedState) {
      dispatch({ type: "loadState", payload: loadedState });
    }
  }, []);

  const handleExitWindowBox = (WindowBox: Windows) => {
    dispatch({ type: "closeWindowBox", payload: WindowBox });
  };

  const handleOpenWindowBox = (WindowBox: Windows) => {
    dispatch({ type: "openWindowBox", payload: WindowBox });
  };

  return (
    <Container>
      {state.windowsOpen.map((window) => {
        const Component = WINDOW_COMPONENTS[window];
        return (
          <Component
            key={`window-${window}`}
            state={state}
            dispatch={dispatch}
            onExit={() => handleExitWindowBox(window)}
          />
        );
      })}
      <div className="flex gap-4 p-4">
        {WINDOW_ICONS.map(({ window, emoji, title, isDisabled }) => (
          <Icon
            key={`icon-${window}`}
            emoji={emoji}
            title={title}
            onClick={() => handleOpenWindowBox(window)}
            isDisabled={isDisabled ? isDisabled(state) : false}
          />
        ))}
      </div>
    </Container>
  );
}
