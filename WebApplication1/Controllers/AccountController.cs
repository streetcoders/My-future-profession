using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    public class AccountController : Controller
    {
        private readonly UserContext db = new UserContext();
        public ActionResult Login()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Login(LoginModel model)
        {
            if (ModelState.IsValid)
            {
                // поиск пользователя в бд
                User user = null;

                String psswrd = await db.Encrypt(model.Email, model.Password);
                user = await db.GetUsersAsync(model.Email, pass: psswrd);

                if (user != null)
                {
                    FormsAuthentication.SetAuthCookie(model.Email, true);
                    return RedirectToAction("Index", "Home");
                }
                else
                {
                    ModelState.AddModelError("", "There is no such user");
                }
            }

            return View(model);
        }
        public ActionResult Register()
        {

            return View();
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async System.Threading.Tasks.Task<ActionResult> Register(RegisterModel model)
        {
            if (ModelState.IsValid)
            {
                User user = null;
                //user = db.Users.Find(new FilterDefinitionBuilder<User>().Regex("Email", new BsonRegularExpression(model.Email))).ToList()[0];

                user = await db.GetUserE(model.Email);
                if (user == null)
                {
                    String psswrd = await db.Encrypt(model.Email, model.Password);
                    await db.Create(new User { Email = model.Email, Password = psswrd, Name = model.Name, Number = model.Number, DateOfBirth = model.DateOfBirth });
                    FormsAuthentication.SetAuthCookie(model.Email, true);
                    return RedirectToAction("Index", "Home");

                }
                else
                {
                    ModelState.AddModelError("", "User with this login is existing");
                }
            }
            return View(model);
        }
        [Authorize]
        public async Task<ActionResult> LogOut()
        {
            FormsAuthentication.SignOut();
            Session.Abandon();
            return RedirectToAction("Login", "Account");
        }

    }

}