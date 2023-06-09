import supabase from '@/lib/supabasetjs'
import { useUser } from '@supabase/ui/dist/cjs/components/Auth/UserContext'
import Link from 'next/link'
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

type Inputs = {
  email: string
  password: string
}

export const Login: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>()
  // const { session, signOut, signInWithGoogle } = useUser()

  // const onSubmit: SubmitHandler<Inputs> = async (data, event): Promise<void> => {
  //   const { email, password } = data

  //   try {
  //     const { error } = await supabase.auth.signIn({
  //       email: email,
  //       password: password,
  //     })

  //     if (error) {
  //       toast.error('ログインエラー。正しいメールアドレス、パスワードを入力してください。')
  //     } else {
  //       toast.success('ログインしました！')
  //     }
  //   } catch (error) {
  //     console.log(error)
  //     toast.error('エラーが発生しました。')
  //   }
  // }

  return (
    <div>
      <h2 className='text-xl mb-4'>Login</h2>
      <div className='mb-8'>
        <Link href={`/signin`}>
          <a className='underline'>アカウントを持っていない方はこちら</a>
        </Link>
      </div>
      <div>
        {/* {session ? (
          <button onClick={signOut} className='border-gray-300'>
            ログアウト
          </button>
        ) : (
          <>
            <button
              onClick={signInWithGoogle}
              className='border-gray-300 border-2 rounded p-1 mb-4'
            >
              Googleでログイン
            </button>
            <div className='mt-4'>
              <h2 className='text-lg font-bold mb-2'>メールアドレスでログイン</h2>
              <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col'>
                <label htmlFor='email'>メールアドレス</label>
                <input
                  id='email'
                  className='py-1 px-2 border-2 w-4/12'
                  {...register('email', { required: true })}
                />
                {errors.email && <span>This field is required</span>}

                <label htmlFor='password'>パスワード</label>
                <input
                  id='password'
                  className='py-1 px-2 border-2 w-4/12'
                  {...register('password', { required: true })}
                />
                {errors.password && <span>This field is required</span>}

                <input className='border-gray-300 border-2 rounded p-1 w-16 mt-4' type='submit' />
              </form>
            </div>
          </>
        )} */}
      </div>
    </div>
  )
}
