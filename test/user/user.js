var crypto = require('crypto')
var bcrypt= require('bcryptjs')
function getRandomString(len) {
  if (!len) len = 16
  return crypto.randomBytes(Math.ceil(len / 2)).toString('hex')
}

var should = require('should')
var app = require('../../app')
var mongoose = require('mongoose')
//var User = require('../../app/models/user')//拿到模型
var User = mongoose.model('User')
var user
// 单元测试开始
describe('<Unit Test', function() {
  describe('Model User:', function() {
    before(function(done) {
      user = {
        name: getRandomString(),
        password: 'password'
      }
      done()
    })
    //测试before
    describe('Before Method save', function() {
      it('should begin without test user', function(done) {
        User.find({name: user.name}, function(err, users) {
          users.should.have.length(0)

          done()
        })
      })
    })
    //测试 save
    describe('User save', function() {
      it('should save without problems', function(done) {
        var _user = new User(user)

        _user.save(function(err) {
          should.not.exist(err)
          _user.remove(function(err) {
            should.not.exist(err)
            done()
          })
        })
      })
      //密码生成
      it('should password be hashed correctly', function(done) {
        var password = user.password
        var _user = new User(user)

        _user.save(function(err) {
          should.not.exist(err)
          _user.password.should.not.have.length(0)

          bcrypt.compare(password, _user.password, function(err, isMatch) {
            should.not.exist(err)
            isMatch.should.equal(true)

            _user.remove(function(err) {
              should.not.exist(err)
              done()
            })
          })
        })
      })
      it('should fail to save an existing user', function(done) {
        var _user1 = new User(user)
        _user1.save(function(err) {
          should.not.exist(err)
          var _user2 = new User(user)
          _user2.save(function(err) {
            should.exist(err)
            _user1.remove(function(err) {
              if (!err) {
                _user2.remove(function(err) {
                  done()
                })
              }
            })
          })
        })
      })
    })

    after(function(done) {
      // clear user info
      done()
    })
  })
})