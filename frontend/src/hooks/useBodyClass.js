import { useEffect } from 'react'

/**
 * Custom hook to manage body class names
 * Adds specified className(s) on mount and removes them on unmount
 *
 * @param {string|string[]} className - Class name(s) to add to document.body
 * @param {boolean} add - Whether to add (true) or remove (false) the class. Defaults to true.
 *
 * @example
 * // Add 'has-sidebar' class
 * useBodyClass('has-sidebar')
 *
 * @example
 * // Remove 'has-sidebar' class
 * useBodyClass('has-sidebar', false)
 *
 * @example
 * // Add multiple classes
 * useBodyClass(['has-sidebar', 'dark-mode'])
 */
export function useBodyClass(className, add = true) {
  useEffect(() => {
    const classes = Array.isArray(className) ? className : [className]

    if (add) {
      // Add classes on mount
      classes.forEach(cls => document.body.classList.add(cls))

      // Remove classes on unmount
      return () => {
        classes.forEach(cls => document.body.classList.remove(cls))
      }
    } else {
      // Remove classes on mount
      classes.forEach(cls => document.body.classList.remove(cls))

      // No cleanup needed when removing classes
      return () => {}
    }
  }, [className, add])
}

export default useBodyClass
