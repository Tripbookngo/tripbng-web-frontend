import axios from 'axios'

export async function SocialSignin({ user }) {
    await axios.post('localhost:4000/api/auth/user/social-login', {
        email: "riteshsingn001008@gmail.com",
        image: "https://lh3.googleusercontent.com/a/ACg8ocJYk6T6xeJ0eklsQV3XApWw1a8cFZ9GaMMhPgBOY446yGQK6muy=s96-c",
        name: "Nikhil",
        socialProvider: "google"
    })

    console.log(user);

}