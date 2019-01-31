(function() {

    let form = document.getElementById('commentform')
  
    if (form) {
      var emailRegex = /[^@\s]+@[^@\s]+\.[^@\s]+$/
      var avatarPreview = document.getElementById('avatarPreview')
      avatarPreview.onerror = (e) => { tryLoad(e.target, 1) }
  
      function changeAvatar() {
        let image = avatarPreview
        image.possible = buildPossibleAvatars(document.getElementById('identity').value)
        image.currentIndex = 0
        tryLoad(image)
      }
  
      function tryLoad(image, increment) {
        if (increment) {
          image.currentIndex += increment
        }
  
        if (image.currentIndex < image.possible.length) {
          image.src = image.possible[image.currentIndex]
        }
        else {
          image.onerror = null
          image.src = image.dataset.fallbacksrc;
        }
      }
  
      function buildPossibleAvatars(identity) {
        let possibleAvatars = []
  
        if (identity.match(emailRegex)) {
          possibleAvatars.push('https://secure.gravatar.com/avatar/' + md5(identity) + '?s=80&d=identicon&r=pg')
        } else {
          possibleAvatars.push('https://github.com/' + identity + '.png')
          possibleAvatars.push('https://avatars.io/twitter/' + identity + '/medium')
        }
  
        return possibleAvatars
      }
  
      document.getElementById('comment-div').oninput = (e) => {
        document.getElementById('message').value = e.target.innerText
      }
  
      document.getElementById('identity').onchange = () => {
        changeAvatar()
      }
  
      document.getElementById('commentbutton').onclick = (e) => {
        let status = document.getElementById('commentstatus')
        status.innerText = ''
  
        let missing = Array.from(form.querySelectorAll('[data-required]')).filter(el => el.value === '').map(el => el.name)
        if (missing.length > 0) {
          status.innerText = 'Some required fields are missing: ' + missing.join(', ') + '.'
          return
        }
        
        let button = e.target
        let confirmText = 'Confirm comment'
        if (button.value != confirmText) {
          button.innerText = confirmText
          button.value = confirmText
          button.title = 'Click the button again to confirm the comment @ ' + Date.now()
          button.classList.add('confirm-button')
          return
        }

        let name = document.getElementById('name')
        let identity = document.getElementById('identity')
        document.getElementById('avatarInput').value = avatarPreview.src
  
        button.disabled = true
        button.innerText = 'Posting...'
        identity.value = ""
        form.action = form.dataset.action
        form.submit()
      }
  
      changeAvatar() // initial load of avatar
    }
  })();