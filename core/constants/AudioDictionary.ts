/**
 * AUDIO DICTIONARY
 * 
 * By using require(), React Native explicitly bundles these static .mp3 files 
 * into the physical payload of the app (the .apk / .ipa file).
 * 
 * This ensures 0ms latency playback with absolute 100% offline reliability 
 * for critical spatial maneuvers.
 */
export const STATIC_AUDIO: Record<string, any> = {
  TURN_LEFT: require('../../assets/audio/turn_left.mp3'),
  TURN_RIGHT: require('../../assets/audio/turn_right.mp3'),
  GO_STRAIGHT: require('../../assets/audio/go_straight.mp3'),
  U_TURN: require('../../assets/audio/u_turn.mp3'),
};