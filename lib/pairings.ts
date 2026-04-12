export interface Pairing {
  parkCode: string;
  figure: string;
  figureBlurb: string;
  /** Direct URL to an NPS or public-domain park scene video used as FaceSwap source */
  sourceVideoUrl: string;
  /** Direct URL to a public-domain photo of the historical figure */
  faceImageUrl: string;
}

export const PAIRINGS: Pairing[] = [
  {
    parkCode: 'yose',
    figure: 'John Muir',
    figureBlurb:
      'Scottish-American naturalist and founder of the Sierra Club who spent years living in Yosemite Valley, whose writings helped establish the national parks system.',
    sourceVideoUrl:
      'https://www.nps.gov/media/video/view.htm?id=B4A4E5D6-1DD8-B71C-07D3EB16D6FA3EC2',
    faceImageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/John_Muir_by_Carleton_Watkins%2C_c1875.jpg/440px-John_Muir_by_Carleton_Watkins%2C_c1875.jpg',
  },
  {
    parkCode: 'yell',
    figure: 'Theodore Roosevelt',
    figureBlurb:
      'The 26th U.S. President who visited Yellowstone in 1903 and protected over 230 million acres of public land, cementing the national parks legacy.',
    sourceVideoUrl:
      'https://www.nps.gov/media/video/view.htm?id=51B86F18-1DD8-B71C-0753D4BBF609B12A',
    faceImageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/President_Roosevelt_-_Pach_Bros_%28cropped%29.jpg/440px-President_Roosevelt_-_Pach_Bros_%28cropped%29.jpg',
  },
  {
    parkCode: 'grca',
    figure: 'John Wesley Powell',
    figureBlurb:
      'Civil War veteran and geologist who led the first documented expedition through the Grand Canyon in 1869, mapping the Colorado River and transforming our understanding of the American West.',
    sourceVideoUrl:
      'https://www.nps.gov/media/video/view.htm?id=60EB1A2A-1DD8-B71C-07D0E7A6D7B1E7C8',
    faceImageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/John_Wesley_Powell_by_Bell%2C_1871.jpg/440px-John_Wesley_Powell_by_Bell%2C_1871.jpg',
  },
  {
    parkCode: 'grte',
    figure: 'Ansel Adams',
    figureBlurb:
      'Iconic American photographer whose black-and-white images of the Grand Tetons helped shape public support for wilderness preservation throughout the 20th century.',
    sourceVideoUrl:
      'https://www.nps.gov/media/video/view.htm?id=7A5C8D3F-1DD8-B71C-07E1A2B3C4D5E6F7',
    faceImageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Ansel_Adams_and_camera.jpg/440px-Ansel_Adams_and_camera.jpg',
  },
];
