import Router from 'next/router'
import { Auth } from '@supabase/ui'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import supabase from '@/lib/supabasetjs'

// export type Profile = {
//   avatarurl: string | null
//   fullname: string | null
//   id: string | null
//   nickname: string | null
// }

const useUser = () => {
  const { user, session } = Auth.useUser()
  // const [profile, setProfile] = useState<Profile | null>(null)

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      fetch('/api/auth', {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        credentials: 'same-origin',
        body: JSON.stringify({ event, session }),
      }).then((res) => res.json())
    })

    return () => {
      // @ts-ignore
      // authListener?.unsubscribe()
    }
  }, [])

  useEffect(() => {
    const setupProfile = async () => {
      if (session?.user?.id) {
        const { data: user } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single()
        // setProfile(user)
      }
    }
    setupProfile()
  }, [session])

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google' })
    toast.success('ログインしました！')
    // Router.push('/')
  }

  const signOut = () => {
    supabase.auth.signOut()
    toast.success('ログアウトしました！')
    // setProfile(null)
    Router.push('/')
  }

  // const updateNickname = async (nickname: string) => {
  //   const { data: newUser } = await supabase
  //     .from('users')
  //     .update({ nickname })
  //     .match({ id: user?.id })
  //     .single()

  //   setProfile(newUser)
  //   toast.success('ニックネームを更新しました！')
  //   Router.push('/account')
  // }

  return {
    user,
    session,
    // profile,
    signInWithGoogle,
    signOut,
    // updateNickname,
  }
}

export { useUser }
