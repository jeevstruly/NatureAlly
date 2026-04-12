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
      'https://assets.mixkit.co/videos/2213/2213-720.mp4',
    faceImageUrl:
      'https://raw.githubusercontent.com/jeevstruly/NatureAlly/master/public/faces/john-muir.jpg',
    videoReady: false,
  },
  {
    parkCode: 'yell',
    figure: 'Theodore Roosevelt',
    figureBlurb:
      'The 26th U.S. President who visited Yellowstone in 1903 and protected over 230 million acres of public land, cementing the national parks legacy.',
    sourceVideoUrl:
      'https://assets.mixkit.co/videos/4396/4396-720.mp4',
    faceImageUrl:
      'https://raw.githubusercontent.com/jeevstruly/NatureAlly/master/public/faces/theodore-roosevelt.jpg',
    videoReady: false,
  },
  {
    parkCode: 'grca',
    figure: 'John Wesley Powell',
    figureBlurb:
      'Civil War veteran and geologist who led the first documented expedition through the Grand Canyon in 1869, mapping the Colorado River and transforming our understanding of the American West.',
    sourceVideoUrl:
      'https://assets.mixkit.co/videos/11022/11022-720.mp4',
    faceImageUrl:
      'https://raw.githubusercontent.com/jeevstruly/NatureAlly/master/public/faces/john-wesley-powell.jpg',
    videoReady: false,
  },
  {
    parkCode: 'grte',
    figure: 'Ansel Adams',
    figureBlurb:
      'Iconic American photographer whose black-and-white images of the Grand Tetons helped shape public support for wilderness preservation throughout the 20th century.',
    sourceVideoUrl:
      'https://assets.mixkit.co/videos/4998/4998-720.mp4',
    faceImageUrl:
      'https://raw.githubusercontent.com/jeevstruly/NatureAlly/master/public/faces/ansel-adams.jpg',
    videoReady: false,
  },
];
