import { useIsomorphicLayoutEffect } from '@/hooks/index'
import { useAtom } from 'jotai'
import { deviceAtom, DeviceType } from '@/atoms/deviceAtom'

const BASE_FONT_SIZE = 16

const deviceSize = {
  mobileS: 320,
  mobileM: 390,
  mobileL: 480,
  tabletS: 768,
  tablet: 1079,
  laptop: 1439,
  desktop: 1440,
  fhd: 1920,
  uhd: 2560
}

const breakpointsArray = [
  {
    size: deviceSize.fhd
  },
  {
    size: deviceSize.laptop,
    noScaleSize: deviceSize.laptop
  },
  {
    size: deviceSize.tablet,
    upscaleSize: deviceSize.laptop
  },
  {
    size: deviceSize.mobileL,
    noScaleSize: deviceSize.mobileL
  },
  {
    size: deviceSize.mobileL,
    noScaleSize: deviceSize.mobileM
  },
  {
    size: deviceSize.mobileM
  },
  {
    size: deviceSize.mobileS,
    upscaleSize: deviceSize.mobileM
  }
]

const getScaleFontSize = (
  windowWidth: number,
  minSize?: number,
  maxSize?: number
) => {
  const currentBreakpoint =
    breakpointsArray.find((item) => item.size < windowWidth) ||
    breakpointsArray[breakpointsArray.length - 1]
  const contentWidth = currentBreakpoint.noScaleSize
    ? currentBreakpoint.size
    : windowWidth <= deviceSize.uhd
    ? windowWidth
    : deviceSize.uhd

  const breakpointSize =
    currentBreakpoint.noScaleSize ||
    currentBreakpoint.upscaleSize ||
    currentBreakpoint.size

  let size = (contentWidth / breakpointSize) * BASE_FONT_SIZE
  if (minSize) {
    size = size < minSize ? minSize : size
  }
  if (maxSize) {
    size = size < maxSize ? size : maxSize
  }

  return size.toFixed(2)
}

const useScaling = () => {
  const [, setDevice] = useAtom(deviceAtom)

  useIsomorphicLayoutEffect(() => {
    const handleWindowResize = () => {
      const viewportWidth = window.innerWidth
      const htmlElement = document.querySelector('html')
      const vh = window.innerHeight * 0.01
      if (htmlElement) {
        const globalFontSize =
          viewportWidth !== null
            ? Number(getScaleFontSize(viewportWidth))
            : BASE_FONT_SIZE
        htmlElement.style.fontSize = `${globalFontSize}px`
      }

      let device: DeviceType = 'desktop'
      if (window.innerWidth <= deviceSize.tabletS) {
        device = 'mobile'
      } else if (window.innerWidth <= deviceSize.tablet) {
        device = 'tablet'
      }
      setDevice(device)
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    }

    window.addEventListener('resize', handleWindowResize)
    handleWindowResize()
    return () => window.removeEventListener('resize', handleWindowResize)
  }, [])
}

export default useScaling
