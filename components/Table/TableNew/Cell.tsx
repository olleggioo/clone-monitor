import { FC, useState } from "react";
import { TableCellI } from "../Table";
import { IconButton, Status } from "@/ui";
import { colorDigits, renderIcon } from "@/helpers";
import styles from "./TableNew.module.scss"
import { IconCopy } from "@/icons";
import { TaskTwoTone } from "@mui/icons-material";
import { useSnackbar } from "notistack";

interface TableCellNewI extends TableCellI {
  index?: number
  styling?: any
  flagCopy?: boolean
  id: string
  changePoolStatusVerbose?: any
}

const Cell: FC<TableCellNewI> = ({
    id,
    onClick,
    onLink,
    url,
    title,
    accessor,
    flagCopy,
    icon,
    description,
    additionalDescription,
    place,
    status,
    bold, 
    align,
    width,
    isLoading,
    state,
    index,
    styling,
    changePoolStatusVerbose
  }) => {
  if (width) {
    width = width > 100 ? 100 : width < 5 ? 5 : width
  }
  // console.log("changePoolStatusVerbose", changePoolStatusVerbose, title)
  const [copied, setCopied] = useState(false)

  const {enqueueSnackbar} = useSnackbar()

  // console.log(accessor === "deviceWorker" && changePoolStatusVerbose === "FAIL" && title)

  return (
    <td className={styles.td}>
      {status ? (
        <Status 
          onClick={onClick} 
          href={`${url}`} 
          id={id}
          tagName="span" 
          correctTitle={state?.firmwareData?.modelId} 
          title={title} 
          state={status} 
          description={description} 
          additionalDescription={additionalDescription}
          place={place}
          style={styling ? {color: '#5820F6'} : {}} 
        />
      ) : accessor === "rateReal"
          ? <>
            {icon && renderIcon(icon)} 
            <p 
              className={styles.text} 
              style={styling ? {color: '#5820F6'} : {}}
            >
              {bold 
                ? <b className={styles.title}>{title}</b> 
                : <span className={styles.title}>{((state?.firmwareData?.rateNow || 0) / 1000).toFixed(1)} TH/s</span>
              }
              {description && <span className={styles.desc}>{description}</span>}
            </p>
          </>
          : accessor==="ipaddr" 
            ? <>
                {icon && renderIcon(icon)}
                <a 
                  className={styles.text} 
                  style={styling ? {color: '#5820F6'} : {}} 
                  href={`${url + title}`} 
                  target='_blank'
                >
                  {bold 
                    ? <b className={styles.title}>{title}</b>
                    : <span className={styles.title}>{title}</span>
                  }
                  {description && <span className={styles.desc}>{description}</span>}
                </a>
              </>
            : accessor === "statuses" 
              ? <div style={{
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px'
                }}>
                  {icon && renderIcon(icon)}
                  <p className={styles.text}>
                    {bold 
                      ? <b className={styles.title}>{title}</b>
                      : <span className={styles.title}>{colorDigits(title)}</span>
                    }
                    {description && <span className={styles.desc}>{description}</span>}
                  </p>
              </div>
              : accessor === "deviceWorker" 
                ? <div>
                    {icon && renderIcon(icon)}
                    <p 
                      className={styles.text} 
                      style={styling ? {color: '#5820F6'} : {}} 
                      onClick={flagCopy 
                        ? () => {
                          navigator.clipboard.writeText(title)
                          .then(() => {
                            setCopied(true)
                            setTimeout(() => setCopied(false), 1000)
                          })
                          .catch(err => {
                            console.error('Ошибка копирования в буфер обмена:', err)
                          });
                        }
                        : () => {}}
                      >
                        {changePoolStatusVerbose 
                          ? changePoolStatusVerbose === "SUCCESS"
                            ? <span className={styles.title}>{title}</span> 
                            : changePoolStatusVerbose === "PENDING"
                              ? <div className={styles.changePoolStatusVerbose}>
                                  <span className={styles.pending} />
                                  <span className={styles.title}>{title}</span>
                              </div>
                              : changePoolStatusVerbose === "FAIL" ? <div className={styles.changePoolStatusVerbose}>
                                <span className={styles.fail} />
                                <span className={styles.title}>{title}</span>
                              </div> : <span className={styles.title}>{title}</span>
                          : <span className={styles.title}>{title}</span>
                        }
                        {/* <span className={styles.title}>{title}</span> */}
                      {description && <span className={styles.desc}>{description}</span>}
                      {copied && <div className={styles.copyStatus}>Скопировано</div>}
                    </p>
                 
                  </div>
                : accessor === "before" || 
                  accessor === "after" || 
                  accessor === "data" ||
                  accessor === "info"
                  ? <>
                    <pre className={styles.text}>
                      <code
                        dangerouslySetInnerHTML={{ __html: title }}
                        onClick={(event: any) => {
                          if (event.target.tagName === 'I') {
                            navigator.clipboard.writeText(event.target.innerText)
                              .then(() => {
                                enqueueSnackbar("Скопировано", {
                                  variant: "success",
                                  autoHideDuration: 3000
                                })
                              })
                              .catch(err => {
                                console.error('Ошибка копирования в буфер обмена:', err);
                              });
                          }
                        }}
                      />
                    </pre>
                  </>
                  
                  : <div style={{
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '10px'
                    }}>
                      {icon && renderIcon(icon)}
                      <p 
                        className={styles.text} 
                        style={styling ? {color: '#5820F6'} : {}} 
                        onClick={flagCopy 
                          ? () => {
                            navigator.clipboard.writeText(title)
                            .then(() => {
                              setCopied(true)
                              setTimeout(() => setCopied(false), 1000)
                            })
                            .catch(err => {
                              console.error('Ошибка копирования в буфер обмена:', err)
                            });
                          }
                          : () => {}}
                        >
                        {bold 
                          ? <b className={styles.title} style={{cursor: "pointer"}}>{title}</b>
                          : <span className={styles.title} style={{cursor: "pointer"}}>{title}</span>
                        }
                        {description && <span className={styles.desc}>{description}</span>}
                        {copied && <div className={styles.copyStatus}>Скопировано</div>}
                      </p>
        </div>
      }
    </td>
    )
}

export default Cell;