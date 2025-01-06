import { Action } from "@/app/manager";
import { State } from "../constants";
import WindowBox from "../WindowBox";
import { Dispatch } from "react";

export default function Notepad({
  state,
  dispatch,
  onExit,
}: {
  state: State;
  dispatch: Dispatch<Action>;
  onExit: () => void;
}) {
  return (
    <WindowBox name="Notepad 📝" onExit={onExit}>
      <div className="h-[500px] sm:w-[550px]">
        <textarea
          className="w-full h-full resize-none hover:outline-none focus:outline-none p-2 overflow-y-auto"
          placeholder="What do you need to do?"
          value={state.notepad}
          onChange={(e) =>
            dispatch({ type: "setNotepad", payload: e.target.value })
          }
        />
      </div>
    </WindowBox>
  );
}
