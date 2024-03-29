import {JsonTrack} from "./jsonTrack";
import {Beat} from "../beat";
import {Track} from "../track";

export interface JsonBeat {
  name: string;
  bpm: number;
  tracks: JsonTrack[];
}

export class Convert{
  public static toBeat(jsonBeat: JsonBeat): Beat{
    const tracks = jsonBeat.tracks.map(x => Convert.toTrack(x));
    return new Beat(jsonBeat.name, jsonBeat.bpm, tracks);
  }

  private static toTrack(jsonTrack: JsonTrack): Track {
    const steps = jsonTrack.steps
      .map(x => x.trim())
      .map(x => Boolean(x));
    return new Track(jsonTrack.name, jsonTrack.fileName, steps);
  }
}
