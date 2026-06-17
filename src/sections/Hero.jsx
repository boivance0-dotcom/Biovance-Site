 import React from 'react'
import ScrollExpandMedia from '../components/ui/scroll-expansion-hero'

const Hero = () => {
 return (
   <div className="mt-16 md:mt-20" style={{marginTop: '-130px',
     zIndex: '20'
   }}>
     <ScrollExpandMedia
       mediaType="video"
       mediaSrc={`${import.meta.env.BASE_URL}assets/178809-860734631.mp4`}
       posterSrc={`${import.meta.env.BASE_URL}assets/41308.jpg`}
       bgImageSrc={`${import.meta.env.BASE_URL}assets/myanmar_tm5_2004349_lrg.jpg`}
       title="Exploring the Intelligence of Nature"
       date=""
       scrollToExpand="Scroll to Explore"
     >
   </ScrollExpandMedia>
   </div>
 )
}

export default Hero;
