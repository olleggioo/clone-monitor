import { FC, memo } from 'react'
import styles from './Pagination.module.scss'
import classNames from 'classnames'
import { PaginationProps } from '@/components/Pagination/Pagination'
import { useAtom } from 'jotai'
import { deviceAtom } from '@/atoms/deviceAtom'
import { devicesUserIdFilterAtom, selectedInputAtom } from '@/atoms/appDataAtom'

const Pagination: FC<PaginationProps> = ({
  limit,
  offset,
  total_count,
  className,
  onPageChange,
  isLoading
}) => {
  const [device] = useAtom(deviceAtom)
  const [selected, setSelected] = useAtom(selectedInputAtom)
  const isMobile = device === 'mobile'
  const totalPages = Math.ceil(total_count / limit)
  const page = offset === 0 ? 1 : offset / limit + 1
  const isFirstPage = page === 1
  const isLastPage = page === totalPages
  const itemsViewed = isLastPage ? total_count : limit * page

  const getButtons = () => {
    const hasSpreadBefore = page > 3 && totalPages > 6
    const hasSpreadAfter = page < totalPages - 2 && totalPages > 6
    let count = totalPages >= 6 ? 4 : totalPages - 2
    let from = page
    let to = isLastPage ? totalPages : totalPages - 1

    if (totalPages >= 6) {
      count =
        count -
        Number(page > 1) -
        Number(hasSpreadAfter) -
        Number(page + 1 === totalPages)

      from =
        page > 2 && page <= totalPages - 2
          ? page - 1
          : page + 1 === totalPages
          ? page - 2
          : isLastPage
          ? page - 3
          : page

      to =
        from + count >= totalPages
          ? totalPages - Number(!isLastPage)
          : from + count
    } else if (totalPages > 2) {
      from = page > 1 ? 2 : 1
      to = isLastPage ? totalPages : totalPages - 1
    }

    let pagesArray = []
    for (let i = from; i <= to; i++) {
      pagesArray.push(i)
    }

    return (
      <>
        {!isFirstPage && (
          <button
            className={styles.btn}
            type="button"
            onClick={() => {
              setSelected(false)
              onPageChange(1)
            }}
          >
            1
          </button>
        )}
        {hasSpreadBefore && (
          <span className={classNames(styles.btn, styles.btn_disabled)}>
            ...
          </span>
        )}
        {pagesArray.map((item) =>
          item === page ? (
            <span
              className={classNames(styles.btn, styles.btn_current)}
              key={item}
            >
              {item}
            </span>
          ) : (
            <button
              className={styles.btn}
              type="button"
              onClick={() => {
                setSelected(false)
                onPageChange(item)
              }}
              key={item}
            >
              {item}
            </button>
          )
        )}
        {hasSpreadAfter && (
          <span className={classNames(styles.btn, styles.btn_disabled)}>
            ...
          </span>
        )}
        {!isLastPage && (
          <button
            className={styles.btn}
            type="button"
            onClick={() => {
              setSelected(false)
              onPageChange(totalPages)
            }}
          >
            {totalPages}
          </button>
        )}
      </>
    )
  }

  const handlePrevClick = () => {
    onPageChange(page - 1)
    setSelected(false)
  }

  const handleNextClick = () => {
    setSelected(false)
    onPageChange(page + 1)
  }

  const handleToFirstClick = () => {
    onPageChange(1)
    setSelected(false)
  }

  const handleToLastClick = () => {
    onPageChange(totalPages)
    setSelected(false)
  }
  const blockClassName = classNames(styles.block, className, {
    [styles.isLoading]: isLoading
  })

  return (
    <div className={blockClassName}>
      <p className={styles.info}>
        Показано {itemsViewed} из {total_count}
      </p>
      
      <div className={styles.list}>
        <button
          className={classNames(styles.btn, {
            [styles.btn_disabled]: page <= 1
          })}
          type="button"
          onClick={handleToFirstClick}
        >{`<<`}</button>
        <button
          className={classNames(styles.btn, {
            [styles.btn_disabled]: page <= 1
          })}
          type="button"
          onClick={handlePrevClick}
        >{`<`}</button>

        {isMobile ? (
          <span className={classNames(styles.btn, styles.btn_current)}>
            {page}
          </span>
        ) : (
          getButtons()
        )}

        <button
          className={classNames(styles.btn, {
            [styles.btn_disabled]: page >= totalPages
          })}
          type="button"
          onClick={handleNextClick}
        >{`>`}</button>
        <button
          className={classNames(styles.btn, {
            [styles.btn_disabled]: page >= totalPages
          })}
          type="button"
          onClick={handleToLastClick}
        >{`>>`}</button>
      </div>
    </div>
  )
}

export default memo(Pagination)
