import { FC } from 'react'
import styles from './Policy.module.scss'
import { Heading } from '@/ui'
import { PolicyPopupI } from '@/components/PolicyPopup/PolicyPopup'
import { Dialog } from '@/components'

const PolicyPopup: FC<PolicyPopupI> = ({ onClose }) => {
  return (
    <Dialog className={styles.block} onClose={onClose} wide closeBtn>
      <Heading
        size="xl"
        text="Политика конфиденциальности"
        className={styles.title}
      />
      <p className={styles.text}>
        By&nbsp;registering a&nbsp;new User Account and/or using any of&nbsp;the
        services and/or visiting any section of&nbsp;on&nbsp;the Website emcd.io
        (hereinafter referred to&nbsp;as&nbsp;&laquo;Website&raquo;), the User
        agrees to&nbsp;be&nbsp;legally bound&nbsp;by: all of&nbsp;the conditions
        specified in&nbsp;these Terms of&nbsp;service (hereinafter referred
        to&nbsp;as&nbsp;&laquo;ToS&raquo;), Privacy Policy, any terms and
        conditions of&nbsp;promotions, bonuses and special offers which may
        be&nbsp;found on&nbsp;the Website from time to&nbsp;time.Please read the
        ToS carefully before accepting them. You agree that you are free
        to&nbsp;choose whether to&nbsp;use the Services on&nbsp;the Website and
        do&nbsp;so&nbsp;at&nbsp;your sole option, discretion and risk.If you
        have any doubts about your rights and obligations resulting from the
        acceptance of&nbsp;the ToS, please consult a&nbsp;lawyer or&nbsp;other
        legal advisor in&nbsp;your jurisdiction. If&nbsp;you do&nbsp;not agree
        to&nbsp;accept and be&nbsp;bound by&nbsp;the ToS please do&nbsp;not open
        an&nbsp;Account, and/or continue to&nbsp;use the Website. Your further
        use of&nbsp;the Website will constitute your acceptance of&nbsp;the ToS.
      </p>
      <div className={styles.content}>
        <h3>Definitions</h3>
        <p>
          1. &laquo;Website&raquo; shall mean webpage at&nbsp;the address with
          all the subsequent services and webpages and computing services relied
          to&nbsp;the Website (hereinafter referred
          to&nbsp;as&nbsp;&laquo;Service&raquo;). The Service shall
          be&nbsp;considered rendered in&nbsp;the territory of&nbsp;Hong Kong
          Special Administrative Region.
        </p>
        <p>
          2. &laquo;Operator&raquo; or&nbsp;&laquo;We&raquo; shall mean
          a&nbsp;legal entity EMCD Tech Limited, registration number 2855638
          with registered office at&nbsp;Flat/RM 1207A, Officeplus @ Prince
          Edward 794-802 Nathan Road, Prince Edward, Hong Kong.
        </p>
        <p>
          3. &laquo;Terms of&nbsp;Use&raquo; shall mean these General ToS and
          any other ToS of&nbsp;the Service, as&nbsp;published on&nbsp;the
          Website.
        </p>
        <p>
          4. &laquo;User&raquo; or&nbsp;&laquo;Miner&raquo;
          or&nbsp;&laquo;You&raquo; shall mean legal entities and/or
          individuals, who provide their computing power to&nbsp;the Operator
          for mining.
        </p>
        <p>
          5. &laquo;User account&raquo; shall mean User&lsquo;s personal webpage
          on&nbsp;the Website, which can only be&nbsp;accessed by&nbsp;the User
          with corresponding login and password, where the User among other
          things enters his or&nbsp;her email address, the address of&nbsp;his
          wallet to&nbsp;receive a&nbsp;Remuneration pursuant to&nbsp;these
          General ToS, and any other information required for the Service.
        </p>
        <p>
          6. &laquo;cryptocurrency&raquo; shall mean Bitcoin (BTC), Litecoin
          (LTC), Bitcoin Cash (BCH), Dash (DASH), Ethereum (ETH), Ethereum
          Classic (ETC), Dogecoin (DOGE) and others, depending on&nbsp;the
          settings of&nbsp;the User Account.
        </p>
        <p>
          7. &laquo;mining&raquo; shall mean the process, in&nbsp;which Miners
          perform mathematical operations to&nbsp;verify and add the
          transactions in&nbsp;a&nbsp;form of&nbsp;so&nbsp;called blocks
          to&nbsp;the public ledger (blockchain) of&nbsp;the cryptocurrency, for
          which they are rewarded with a&nbsp;certain amount of&nbsp;prospective
          cryptocurrency and certain amount of&nbsp;transaction fees.8.
          &laquo;transaction fees&raquo; shall mean the fees for verification
          and addition of&nbsp;transactions to&nbsp;the cryptocurrency
          blockchain, and therefore it&nbsp;can be&nbsp;in&nbsp;every single
          verified transaction perceived as&nbsp;a&nbsp;difference between the
          amount of&nbsp;the cryptocurrency sent by&nbsp;the sender and the
          cryptocurrency received by&nbsp;the recipient.9. &laquo;wallet&raquo;
          shall mean an&nbsp;external virtual wallet, in&nbsp;which any
          individual User can manage its obtained virtual cryptocurrencies.10.
          &laquo;hashrate&raquo; shall mean a&nbsp;unit of&nbsp;computing power
          of&nbsp;the mining hardware.11. &laquo;offer&raquo; is&nbsp;the
          current ToS. It&nbsp;is&nbsp;considered to&nbsp;be&nbsp;accepted and
          the Contract to&nbsp;be&nbsp;concluded by&nbsp;the User at&nbsp;the
          moment of&nbsp;registration of&nbsp;a&nbsp;User Account.12.
          &laquo;Contract&raquo; shall mean the agreement on&nbsp;provision
          of&nbsp;computing power (that is&nbsp;performing of&nbsp;the computing
          operations), concluded between the Operator and the User at&nbsp;the
          moment of&nbsp;registration of&nbsp;the User Account for the term
          of&nbsp;the User Account, under which the User undertakes
          to&nbsp;provide the computing power in&nbsp;exchange for the
          cryptocurrencies mining and which is&nbsp;governed by&nbsp;these ToS.
        </p>
      </div>
    </Dialog>
  )
}

export default PolicyPopup
