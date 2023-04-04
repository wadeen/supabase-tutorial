import { Auth, Typography, Button } from '@supabase/ui'
import supabase from '@/lib/supabasetjs'
import { toast } from 'react-toastify'

const { Text } = Typography

const Container = (props: any) => {
  // Auth.useUser() -> { user, session, error }

  const { user, session } = Auth.useUser()

  // const signInWithGoogle = async () => {
  //   await supabase.auth.signInWithOAuth({ provider: 'google' })
  //   toast.success('ログインしました！')
  //   // Router.push('/')
  // }

  if (user) {
    return (
      <>
        <Text>Signed in: {user.email}</Text>
        <Button block onClick={() => props.supabaseClient.auth.signOut()}>
          Sign out
        </Button>
      </>
    )
  }
  return props.children
}

export const AuthBasic = () => {
  return (
    <Auth.UserContextProvider supabaseClient={supabase}>
      <Container supabaseClient={supabase}>
        <Auth providers={['github']} supabaseClient={supabase} />
      </Container>
    </Auth.UserContextProvider>
  )
}
