import Center from "@components/Center";

// TODO: Include ability to use video streams captured by media-stream-track-controller as the background (show as thumbnails)
// TODO: Use default Desktop backgroundView as a thumbnail
// TODO: Use zenOSmosis logo as a background option

// TODO: Use particles as potential background
// TODO: Use solid colors as potential background
// TODO: Allow user-defined URL as potential background

// TODO: Backgrounds?
// @see https://coolbackgrounds.io (particles: https://github.com/marcbruederlin/particles.js)
// @see [Unsplash 3D renders] https://unsplash.com/blog/unsplash-library-now-accepts-3d-renders/?utm_source=vero&utm_medium=email&utm_content=control&utm_campaign=Unsplash%20Awards%20Announcement&utm_term=Newsletter&vero_id=6421463&vero_conv=PmNPLiUVlfrNjJJhv6nsCKDC_PNDDxf0FWY02n1x7jyPWwq0KgHl-nQmk0Pq6aTzRvvwjcixMGRPZlAmMwIqQz72F0DGURijjA%3D%3D

export const REGISTRATION_ID = "background-selector";

const BackgroundSelectorApp = {
  id: REGISTRATION_ID,
  title: "Background Selector",
  style: {
    width: 640,
    height: 300,
  },
  // serviceClasses: [InputMediaDevicesService],
  view: function View({ appServices }) {
    return <Center>TODO: Background Selector</Center>;
  },
};

export default BackgroundSelectorApp;
