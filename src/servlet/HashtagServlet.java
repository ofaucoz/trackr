package servlet;

import static org.apache.commons.lang3.StringEscapeUtils.escapeHtml4;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.Servlet;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.hibernate.Session;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;

import ressources.SFactory;
import ressources.Tweet;
import ressources.TwitterBuilder;
import ressources.User;

/**
 * Servlet implementation class Auth
 */
@WebServlet("/hashtag")
public class HashtagServlet extends HttpServlet implements Servlet {
	private static final long serialVersionUID = 2L;

	public HashtagServlet() {
		super();
	}

	@Override
	public void init() throws ServletException {
		super.init();
	}

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		PrintWriter out = response.getWriter();
		Session session = SFactory.getSession();
		List<Tweet> listTweet = new ArrayList<Tweet>();
		String hashtag = escapeHtml4(request.getParameter("hashtag"));
		String url = "https://api.twitter.com/1.1/search/tweets.json?q=" + hashtag;
		TwitterBuilder twitterBuilder = new TwitterBuilder();
		ObjectMapper objectMapper = new ObjectMapper();
		listTweet = twitterBuilder.queryAndCreate(url, session);
		objectMapper.enable(SerializationFeature.INDENT_OUTPUT);
		out.println(objectMapper.writeValueAsString(listTweet));		
		session.close();
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		doGet(request, response);
	}

}
