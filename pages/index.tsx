import { GetServerSidePropsContext, NextPage } from 'next'
import supabase from '@/lib/supabase'
import { Auth } from '@supabase/ui'
import styles from '../styles/pages/index.module.scss'
import { AuthBasic } from '@/components/Auth'
import TodoPage from './todo'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const Index: NextPage = () => {
  return (
    <div className={styles.container}>
      <AuthBasic />
      {/* <button type='button'>ログイン</button> */}
    </div>
  )
}

export default Index
