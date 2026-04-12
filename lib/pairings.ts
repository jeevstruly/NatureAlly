export interface Pairing {
  parkCode: string;
  figure: string;
  figureBlurb: string;
  /**
   * Direct URL to a downloadable park scene video file (.mp4) used as FaceSwap source.
   * Must be a direct file URL, not an HTML viewer page.
   * Find real URLs via: https://developer.nps.gov/api/v1/multimedia/videos?parkCode=<code>
   */
  sourceVideoUrl: string;
  /** Direct URL to a public-domain photo of the historical figure */
  faceImageUrl: string;
  /** Set to true once the face-swap video has been generated and placed in public/videos/ */
  videoReady: boolean;
}

export const PAIRINGS: Pairing[] = [
  {
    parkCode: 'yose',
    figure: 'John Muir',
    figureBlurb:
      'Scottish-American naturalist and founder of the Sierra Club who spent years living in Yosemite Valley, whose writings helped establish the national parks system.',
    sourceVideoUrl:
      'https://www.nps.gov/nps-audiovideo/legacy/yose/C7184DE3-1DD8-B71B-0BB5002612DF0F58/yose-YNNYoseGrantMASTER_1280x720.mp4',
    faceImageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/John_Muir_by_Carleton_Watkins%2C_c1875.jpg/440px-John_Muir_by_Carleton_Watkins%2C_c1875.jpg',
    videoReady: false,
  },
  {
    parkCode: 'yell',
    figure: 'Theodore Roosevelt',
    figureBlurb:
      'The 26th U.S. President who visited Yellowstone in 1903 and protected over 230 million acres of public land, cementing the national parks legacy.',
    sourceVideoUrl:
      'https://www.nps.gov/nps-audiovideo/audiovideo/6b4e0788-530b-4e8a-9846-13bbe51a269d720p.mp4',
    faceImageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/President_Roosevelt_-_Pach_Bros_%28cropped%29.jpg/440px-President_Roosevelt_-_Pach_Bros_%28cropped%29.jpg',
    videoReady: false,
  },
  {
    parkCode: 'grca',
    figure: 'John Wesley Powell',
    figureBlurb:
      'Civil War veteran and geologist who led the first documented expedition through the Grand Canyon in 1869, mapping the Colorado River and transforming our understanding of the American West.',
    sourceVideoUrl:
      'https://www.nps.gov/nps-audiovideo/legacy/grca/A7F55C2B-FDB0-08D2-3984E481482AF041/grca-DarkSkiesVideoFINAL_1280x720.mp4',
    faceImageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/John_Wesley_Powell_by_Bell%2C_1871.jpg/440px-John_Wesley_Powell_by_Bell%2C_1871.jpg',
    videoReady: false,
  },
  {
    parkCode: 'grte',
    figure: 'Ansel Adams',
    figureBlurb:
      'Iconic American photographer whose black-and-white images of the Grand Tetons helped shape public support for wilderness preservation throughout the 20th century.',
    sourceVideoUrl:
      'https://www.nps.gov/nps-audiovideo/legacy/grte/2757E7D2-155D-451F-671C5E44B024C385/grte-USU-photgrapher_480x270.mp4',
    faceImageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Ansel_Adams_and_camera.jpg/440px-Ansel_Adams_and_camera.jpg',
    videoReady: false,
  },
];
